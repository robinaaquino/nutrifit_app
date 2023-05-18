import {
  ProductCategoriesList,
  ProductsDatabaseTypeFromDB,
} from "../constants/product_constants";
import { FunctionResult } from "../constants/function_constants";
import { parseError } from "../helpers";
import { getAllDocumentsGivenTypeFunction } from "./general_functions";
import { CollectionsEnum, ResultTypeEnum } from "../constants/enum_constants";
import { UsersDatabaseType } from "../constants/user_constants";
import { OrdersDatabaseFromDBType } from "../constants/orders_constants";
import { SuccessCodes, ErrorCodes } from "../constants/success_and_error_codes";
import { AdminAnalyticsType } from "../constants/dashboard_constant";

export const getAllAdminAnalytics = async () => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };
  let resultOfAdminAnalytics: AdminAnalyticsType = {
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
    const getAllUsersResult = await getAllDocumentsGivenTypeFunction(
      CollectionsEnum.USER
    );

    if (!getAllUsersResult.isSuccess) {
      return getAllUsersResult;
    }
    const allUsers: UsersDatabaseType[] =
      getAllUsersResult.result as UsersDatabaseType[];
    resultOfAdminAnalytics.numberOfTotalUsers = allUsers.length;

    const getAllProductsResult = await getAllDocumentsGivenTypeFunction(
      CollectionsEnum.PRODUCT
    );

    if (!getAllProductsResult.isSuccess) {
      return getAllProductsResult;
    }

    for (let i = 0; i < ProductCategoriesList.length; i++) {
      let categorySales: any = {
        category: ProductCategoriesList[i],
        sales: 0,
      };
      resultOfAdminAnalytics.salesPerCategory.push(categorySales);
    }

    const allProducts: ProductsDatabaseTypeFromDB[] =
      getAllProductsResult.result as ProductsDatabaseTypeFromDB[];

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

    const getAllDocumentsForOrdersResult =
      await getAllDocumentsGivenTypeFunction(CollectionsEnum.ORDER);

    if (!getAllDocumentsForOrdersResult.isSuccess) {
      return getAllDocumentsForOrdersResult;
    }

    const allOrders: OrdersDatabaseFromDBType[] =
      getAllDocumentsForOrdersResult.result as OrdersDatabaseFromDBType[];

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

    resultOfAdminAnalytics.frequentlyBoughtProducts = tempArray.slice(0, 6);

    tempArray = tempArray.sort((a: any, b: any) =>
      a["totalProfit"] > b["totalProfit"]
        ? -1
        : b["totalProfit"] > a["totalProfit"]
        ? 1
        : 0
    );

    resultOfAdminAnalytics.highestGrossingProducts = tempArray.slice(0, 6);

    resultObject = {
      result: resultOfAdminAnalytics,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: true,
      message: SuccessCodes["best-selling-products"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: resultOfAdminAnalytics,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage
        ? errorMessage
        : ErrorCodes["best-selling-products"],
    };
  }

  return resultObject;
};

// export const template = async () => {
//   let resultObject: FunctionResult = {
//     result: "",
//     isSuccess: false,
//     message: "",
//     message: "",
//   };
//   let datas: any[] = [];

//   try {
//     resultObject = {
//       result: datas,
//       isSuccess: true,
//       message: "Successful in getting all products",
//       message: "",
//     };
//   } catch (e) {
//     resultObject = {
//       result: datas,
//       isSuccess: true,
//       message: "Failed in getting all products",
//       message: parseError(e),
//     };
//   }

//   return resultObject;
// };
