import nookies from "nookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import admin from "@/firebase/admin-config";
import { useAuthContext } from "@/context/AuthContext";

import { getAllAdminAnalytics } from "@/firebase/firebase_functions/dashboard_functions";
import { splitLabel } from "@/firebase/helpers";

import TableComponent from "@/components/admin/TableComponent";
import CardStats from "@/components/admin/dashboard/CardStats";
import CarouselProduct from "@/components/admin/dashboard/CarouselProduct";
import { AdminAnalyticsType } from "@/firebase/constants/dashboard_constant";
import { isUserAuthorizedFunction } from "@/firebase/firebase_functions/users_functions";

import HeadingTwo from "@/components/forms/HeadingTwo";

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

  const barChartOptions = {
    indexAxis: "y" as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  const bestSellingProductsLabel =
    props.adminAnalytics.highestGrossingProducts.map((element: any) =>
      splitLabel(element.name)
    );
  const bestSellingProductsDataset =
    props.adminAnalytics.highestGrossingProducts.map(
      (element: any) => element.totalProfit
    );

  const bestSellingProductsData = {
    labels: bestSellingProductsLabel,
    datasets: [
      {
        label: "Total profit",
        data: bestSellingProductsDataset,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const frequentlyBoughtProductsLabel =
    props.adminAnalytics.frequentlyBoughtProducts.map((element: any) =>
      splitLabel(element.name)
    );
  const frequentlyBoughtProductsDataset =
    props.adminAnalytics.frequentlyBoughtProducts.map(
      (element: any) => element.quantity
    );

  const frequentlyBoughtProductsData = {
    labels: frequentlyBoughtProductsLabel,
    datasets: [
      {
        label: "Quantity sold",
        data: frequentlyBoughtProductsDataset,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  async function fetchAllDataForAdminDashboard() {
    const adminAnalytics: AdminAnalyticsType = props.adminAnalytics;

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

  useEffect(() => {
    fetchAllDataForAdminDashboard();
  }, []);

  if (props.isError) {
    error(props.message);
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
              <div>
                <HeadingTwo label="Frequently bought products" />
                <Bar
                  options={barChartOptions}
                  data={frequentlyBoughtProductsData}
                />
              </div>
              <div>
                <HeadingTwo label="Best selling products" />
                <Bar options={barChartOptions} data={bestSellingProductsData} />
                ;
              </div>
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

    const getAllAdminAnalyticsResult = await getAllAdminAnalytics();
    let adminAnalytics: AdminAnalyticsType =
      getAllAdminAnalyticsResult.result as AdminAnalyticsType;

    if (getAllAdminAnalyticsResult.isSuccess) {
      return {
        props: {
          authorized: isAdmin,
          adminAnalytics: adminAnalytics,
          isError: false,
          message: "",
          redirect: "",
        },
      };
    } else {
      return {
        props: {
          authorized: isAdmin,
          isError: true,
          message: "",
          redirect: "",
        },
      };
    }
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
