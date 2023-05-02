import nookies from "nookies";
import admin from "@/firebase/admin-config";

import { getUserFunction } from "@/firebase/firebase_functions/users_function";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllAdminAnalytics } from "@/firebase/firebase_functions/dashboard_functions";
import TableComponent from "@/components/admin/TableComponent";
import CardStats from "@/components/admin/dashboard/CardStats";
import CarouselProduct from "@/components/admin/dashboard/CarouselProduct";
import { getBestSellingProducts } from "@/firebase/firebase_functions/products_function";

export default function AdminDashboard(props: any) {
  const { error } = useAuthContext();
  const router = useRouter();
  const headers = ["Category", "Sales"];
  const contentKeys = ["category", "sales"];

  const [salesPerCategory, setSalesPerCategory] = useState<any>([]);
  const [frequentlyBoughtProducts, setFrequentlyBoughtProducts] = useState<any>(
    []
  );
  const [bestSellingProducts, setBestSellingProducts] = useState<any>([]);

  const [orderCount, setOrderCount] = useState<number>(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [deliveredOrdersCount, setDeliveredOrdersCount] = useState<number>(0);
  const [cancelledOrdersCount, setCancelledOrdersCount] = useState<number>(0);

  const [userCount, setUserCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);

  async function fetchAllDataForAdminDashboard() {
    const getAllAdminAnalyticsResult = await getAllAdminAnalytics();
    const adminAnalytics = getAllAdminAnalyticsResult.result;
    console.log(getAllAdminAnalyticsResult);

    if (!getAllAdminAnalyticsResult.isSuccess) {
      error(getAllAdminAnalyticsResult.resultText);
    } else {
      setSalesPerCategory(adminAnalytics.salesPerCategory);
      setFrequentlyBoughtProducts(adminAnalytics.frequentlyBoughtProducts);
      setBestSellingProducts(adminAnalytics.highestGrossingProducts);

      setOrderCount(adminAnalytics.numberOfTotalOrders);
      setProductCount(adminAnalytics.numberOfTotalProducts);
      setUserCount(adminAnalytics.numberOfTotalUsers);

      setPendingOrdersCount(adminAnalytics.numberOfPendingOrders);
      setCancelledOrdersCount(adminAnalytics.numberOfCancelledOrders);
      setDeliveredOrdersCount(adminAnalytics.numberOfDeliveredOrders);
    }
  }

  useEffect(() => {
    fetchAllDataForAdminDashboard();
  }, []);

  if (props.isError) {
    error(props.errorMessage);
    router.push(props.redirect);
    return null;
  }

  return (
    <>
      <div className="container px-4 mx-auto min-h-screen">
        {/* Stats */}
        <div className="relative">
          <div className="px-4 mx-auto w-full">
            <div className="flex">
              {/* Cards */}
              {/* Orders */}
              <CardStats
                mainText={"Orders"}
                count={orderCount}
                icon="order"
                subValues={[
                  { key: "pending orders", count: pendingOrdersCount },
                  { key: "delivered orders", count: deliveredOrdersCount },
                  { key: "cancelled orders", count: cancelledOrdersCount },
                ]}
              ></CardStats>
              {/* Users */}
              <CardStats
                mainText={"Users"}
                count={userCount}
                icon="user"
              ></CardStats>
              {/* Products */}
              <CardStats
                mainText={"Products"}
                count={productCount}
                icon="product"
              ></CardStats>
            </div>
          </div>
          <div className="px-4 w-full flex">
            {/* Product Rankings */}
            <div className="grid grid-cols-1 gap-4 w-full m-2 p-2 ">
              <CarouselProduct
                carouselName="Frequently bought products"
                items={frequentlyBoughtProducts}
              ></CarouselProduct>
              <CarouselProduct
                carouselName="Best selling products"
                items={bestSellingProducts}
              ></CarouselProduct>
            </div>
            {/* Sales per Category */}
            <div className="w-1/3 m-2 p-2">
              <h2 className="mb-6 text-4xl font-bold text-center text-black">
                Sales per category
              </h2>
              <TableComponent
                headers={headers}
                contentKeys={contentKeys}
                content={salesPerCategory}
                type={"sale"}
                disablePagination={true}
              ></TableComponent>
            </div>
          </div>
        </div>
        <div></div>
        {/* Other Analytics */}
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
