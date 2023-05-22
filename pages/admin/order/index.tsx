import nookies from "nookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthContext } from "@/context/AuthContext";
import admin from "@/firebase/admin-config";

import Filter from "@/components/filter/Filter";
import SearchBar from "@/components/universal/SearchBar";
import TableComponent from "@/components/admin/TableComponent";

import { CollectionsEnum } from "@/firebase/constants/enum_constants";
import { OrdersDatabaseType } from "@/firebase/constants/orders_constants";

import {
  applyFilterFunction,
  applySearchFunction,
} from "@/firebase/firebase_functions/filter_and_search_functions";
import { getAllDocumentsGivenTypeFunction } from "@/firebase/firebase_functions/general_functions";
import { isUserAuthorizedFunction } from "@/firebase/firebase_functions/users_functions";

export default function AdminOrder(props: any) {
  const [orders, setOrders] = useState<OrdersDatabaseType[]>([]);
  const [loading, setLoading] = useState(false);
  const { error } = useAuthContext();
  const router = useRouter();

  const tableHeaders: string[] = [
    "ID",
    "Email",
    "First name",
    "Last name",
    "Total price",
    "Status",
    "Delivery mode",
    "Date ordered",
    "Date cleared",
  ];

  const tableContentKeys: string[] = [
    "id",
    "email",
    "first_name",
    "last_name",
    "total_price",
    "status",
    "delivery_mode",
    "created_at",
    "date_cleared",
  ];

  async function fetchAllOrders() {
    setLoading(true);
    const result = await getAllDocumentsGivenTypeFunction(
      CollectionsEnum.ORDER
    );

    const resultInformation = result.result as OrdersDatabaseType[];

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setOrders(resultInformation);
    }
    setLoading(false);
  }

  async function handleSearch(searchString: any) {
    setLoading(true);
    const result = await applySearchFunction(
      CollectionsEnum.ORDER,
      searchString
    );
    if (!result.isSuccess) {
      error(result.message);
    } else {
      setOrders(result.result);
    }
    setLoading(false);
  }

  async function handleFilters(filter: any) {
    setLoading(true);
    const result = await applyFilterFunction(CollectionsEnum.ORDER, filter);
    if (!result.isSuccess) {
      error(result.message);
    } else {
      setOrders(result.result);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (props.isError) {
    error(props.message);
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
              resetFilter={fetchAllOrders}
              isOrderFilter={true}
            />
          </div>
        </div>

        <TableComponent
          headers={tableHeaders}
          contentKeys={tableContentKeys}
          content={orders}
          type="order"
          isAdmin={true}
          loading={loading}
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

    const isAdmin = await isUserAuthorizedFunction(uid);

    if (!isAdmin) {
      return {
        props: {
          isError: true,
          message: "Unauthorized access",
          redirect: "/",
        },
      };
    }

    return {
      props: {
        authorized: isAdmin,
        isError: false,
        message: "",
        redirect: "",
      },
    };
  } catch (err) {
    return {
      props: {
        isError: true,
        message: "Unauthenticated access",
        redirect: "/login",
      },
    };
  }
}
