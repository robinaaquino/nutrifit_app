import {
  FunctionResult,
  PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY,
} from "../constants";
import { getAllProductsFunction } from "./products_function";
import { parseError } from "../helpers";
import { resourceLimits } from "worker_threads";
import { getAllOrdersFunction } from "./orders_functions";
import { getAllUsersFunction } from "./users_function";

export const getAllAdminAnalytics = async () => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let resultOfAdminAnalytics: any = {
    salesPerCategory: [],
    totalProfit: 0,
    numberOfPendingOrders: 0,
    numberOfCancelledOrders: 0,
    numberOfDeliveredOrders: 0,
    frequentlyBoughtProducts: [],
    highestGrossingProducts: [],
    numberOfTotalOrders: 0,
    numberOfTotalUsers: 0,
    numberOfTotalProducts: 0,
  };

  try {
    let dateToday = new Date();
    const getAllUsersResult = await getAllUsersFunction();

    if (!getAllUsersResult.isSuccess) {
      return {
        result: resultOfAdminAnalytics,
        isSuccess: true,
        resultText: "Failed in getting all users for admin analytics",
        errorMessage: getAllUsersResult.errorMessage,
      };
    }
    resultOfAdminAnalytics.numberOfTotalUsers = getAllUsersResult.result.length;

    const getAllProductsResult = await getAllProductsFunction();

    if (!getAllProductsResult.isSuccess) {
      return {
        result: resultOfAdminAnalytics,
        isSuccess: true,
        resultText: "Failed in getting all products for admin analytics",
        errorMessage: getAllProductsResult.errorMessage,
      };
    }

    for (let i = 0; i < PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.length; i++) {
      let categorySales: any = {
        category: PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY[i],
        sales: 0,
      };
      resultOfAdminAnalytics.salesPerCategory.push(categorySales);
    }

    const allProducts = getAllProductsResult.result;

    for (let i = 0; i < allProducts.length; i++) {
      resultOfAdminAnalytics.numberOfTotalProducts += 1;
      const currentProduct = allProducts[i];
      resultOfAdminAnalytics.totalProfit +=
        currentProduct.price * currentProduct.quantity_sold;
      for (let j = 0; j < resultOfAdminAnalytics.salesPerCategory.length; j++) {
        if (
          currentProduct.category ==
          resultOfAdminAnalytics.salesPerCategory[j].category
        ) {
          resultOfAdminAnalytics.salesPerCategory[j].sales +=
            currentProduct.price * currentProduct.quantity_sold;
        }
      }
    }

    const getAllOrdersResult = await getAllOrdersFunction();

    if (!getAllOrdersResult.isSuccess) {
      return {
        result: resultOfAdminAnalytics,
        isSuccess: true,
        resultText: "Failed in getting sales per category",
        errorMessage: getAllOrdersResult.errorMessage,
      };
    }

    const allOrders = getAllOrdersResult.result;

    let frequentlyBoughtTemp: any = {};
    for (let i = 0; i < allOrders.length; i++) {
      resultOfAdminAnalytics.numberOfTotalOrders += 1;
      const currentOrder = allOrders[i];
      if (currentOrder.status == "pending") {
        resultOfAdminAnalytics.numberOfPendingOrders += 1;
      } else if (currentOrder.status == "cancelled") {
        resultOfAdminAnalytics.numberOfCancelledOrders += 1;
      } else if (currentOrder.status == "delivered") {
        resultOfAdminAnalytics.numberOfDeliveredOrders += 1;
      }

      const previousMonth = new Date(
        dateToday.setMonth(dateToday.getMonth() - 1)
      );

      if (
        currentOrder.products && //if order has products
        currentOrder.status == "delivered" && //if order has delivered
        previousMonth < new Date(currentOrder.updated_at) //in the past month only
      ) {
        let currentOrderProducts = currentOrder.products;
        currentOrderProducts.map((currentProduct: any) => {
          if (!frequentlyBoughtTemp[currentProduct.id]) {
            frequentlyBoughtTemp[currentProduct.id] = currentProduct.quantity;
          } else {
            frequentlyBoughtTemp[currentProduct.id] += currentProduct.quantity;
          }
        });
      }
    }

    let tempArray: any = [];
    allProducts.map((currentProduct: any) => {
      for (let key in frequentlyBoughtTemp) {
        let value: number = frequentlyBoughtTemp[key];
        if (key == currentProduct.id) {
          tempArray.push({
            ...currentProduct,
            quantity: value,
            totalProfit: value * currentProduct.price,
          });
          break;
        }
      }
    });

    //sort temp array in descending order
    tempArray = tempArray.sort((a: any, b: any) =>
      a["quantity"] > b["quantity"] ? -1 : b["quantity"] > a["quantity"] ? 1 : 0
    );

    resultOfAdminAnalytics.frequentlyBoughtProducts = tempArray;

    tempArray = tempArray.sort((a: any, b: any) =>
      a["totalProfit"] > b["totalProfit"]
        ? -1
        : b["totalProfit"] > a["totalProfit"]
        ? 1
        : 0
    );

    resultOfAdminAnalytics.highestGrossingProducts = tempArray;

    resultObject = {
      result: resultOfAdminAnalytics,
      isSuccess: true,
      resultText: "Successful in getting sales per category",
      errorMessage: "",
    };
  } catch (e) {
    resultObject = {
      result: resultOfAdminAnalytics,
      isSuccess: true,
      resultText: "Failed in getting sales per category",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

// export const template = async () => {
//   let resultObject: FunctionResult = {
//     result: "",
//     isSuccess: false,
//     resultText: "",
//     errorMessage: "",
//   };
//   let datas: any[] = [];

//   try {
//     resultObject = {
//       result: datas,
//       isSuccess: true,
//       resultText: "Successful in getting all products",
//       errorMessage: "",
//     };
//   } catch (e) {
//     resultObject = {
//       result: datas,
//       isSuccess: true,
//       resultText: "Failed in getting all products",
//       errorMessage: parseError(e),
//     };
//   }

//   return resultObject;
// };
