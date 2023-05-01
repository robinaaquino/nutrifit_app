import nookies from "nookies";
import admin from "@/firebase/admin-config";

import Filter from "@/components/universal/filter";
import SearchBar from "@/components/universal/search_bar";
import TableComponent from "@/components/admin/TableComponent";

import {
  getAllOrdersFunction,
  getAllOrdersWithFilterFunction,
  getAllOrdersWithSearchFunction,
} from "@/firebase/firebase_functions/orders_functions";
import { OrdersDatabaseType } from "@/firebase/constants";
import { getUserFunction } from "@/firebase/firebase_functions/users_function";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminOrder(props: any) {
  const [orders, setOrders] = useState<OrdersDatabaseType[]>([]);
  const { error } = useAuthContext();
  const router = useRouter();

  const tableHeaders: string[] = [
    "ID",
    "User ID",
    "Total price",
    "Status",
    "Delivery mode",
    "Date ordered",
    "Date cleared",
  ];

  const tableContentKeys: string[] = [
    "id",
    "user_id",
    "total_price",
    "status",
    "delivery_mode",
    "created_at",
    "date_cleared",
  ];

  async function fetchAllOrders() {
    const result = await getAllOrdersFunction();

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setOrders(result.result);
    }
  }

  async function handleSearch(searchString: any) {
    const result = await getAllOrdersWithSearchFunction(searchString);
    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setOrders(result.result);
    }
  }

  async function handleFilters(filter: any) {
    const result = await getAllOrdersWithFilterFunction(filter);
    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setOrders(result.result);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (props.isError) {
    error(props.errorMessage);
    router.push(props.redirect);
    return null;
  }

  return (
    <>
      <div className="container px-4 mx-auto min-h-screen">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-x-3">
              <h2 className="text-lg font-medium text-black ">Orders</h2>

              <span className="px-3 py-1 text-xs text-white bg-nf_green rounded-full">
                {orders.length} {orders.length == 1 ? "order" : "orders"}
              </span>
            </div>
          </div>

          <div className="flex items-center mt-4 gap-x-3">
            <SearchBar handleSearch={handleSearch} />
            <Filter
              handleFilters={handleFilters}
              // isProductFilter={true}
              resetFilter={fetchAllOrders}
              isOrderFilter={true}
              // isCustomerFilter={true}
            />
          </div>
        </div>

        <TableComponent
          headers={tableHeaders}
          contentKeys={tableContentKeys}
          content={orders}
          type="order"
          isAdmin={true}
        />
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const cookies = nookies.get(context);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    const isAdminResult = await getUserFunction(uid);
    const isAdmin = isAdminResult.result.role == "admin" ? true : false;

    if (!isAdmin) {
      return {
        props: {
          isError: true,
          errorMessage: "Unauthorized access",
          redirect: "/",
        },
      };
    }

    return {
      props: {
        message: `Your email is ${email} and your UID is ${uid}.`,
        authorized: isAdmin,
        isError: false,
        errorMessage: "",
        redirect: "",
      },
    };
  } catch (err) {
    return {
      props: {
        isError: true,
        errorMessage: "Unauthenticated access",
        redirect: "/login",
      },
    };
  }
}
