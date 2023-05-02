import { db, storage } from "../config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  getDoc,
  addDoc,
} from "firebase/firestore";
import * as Constants from "../constants";
import { FunctionResult } from "@/firebase/constants";
import { parseError } from "../helpers";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { getProductViaIdFunction } from "./products_function";

export const getAllOrdersFunction = async () => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const docs = await getDocs(collection(db, "orders"));

    docs.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      datas.push({
        id,
        ...data,
      });
    });

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Successful in getting all orders",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in getting all orders",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getAllOrdersViaIdFunction = async (userId: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const docs = await getDocs(collection(db, "orders"));

    docs.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      if (data.user_id == userId) {
        datas.push({
          id,
          ...data,
        });
      }
    });

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Successful in getting all orders for user",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in getting all orders for user",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getAllOrdersWithFilterFunction = async (filter: any) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];
  let orderQuery: any[] = [];

  try {
    if (filter.status) {
      orderQuery.push(where("status", "==", filter.status));
    }

    if (filter.deliveryMode) {
      orderQuery.push(where("delivery_mode", "==", filter.deliveryMode));
    }

    if (filter.minPrice != 0) {
      orderQuery.push(where("total_price", ">", filter.minPrice));
    }

    if (filter.maxPrice != 0) {
      orderQuery.push(where("total_price", "<", filter.maxPrice));
    }

    const orderReference = query(collection(db, "orders"), ...orderQuery);

    const docs = await getDocs(orderReference);
    docs.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      datas.push({
        id,
        ...data,
      });
    });

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Successful in getting all orders with filter",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in getting all orders with filter",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getAllOrdersWithSearchFunction = async (searchString: any) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const result = await getAllOrdersFunction();

    if (!result.isSuccess) {
      resultObject = {
        result: datas,
        isSuccess: false,
        resultText: "Failed in getting all orders with search string",
        errorMessage: result.errorMessage,
      };
    }

    const orders = result.result;

    const individualStrings = searchString.toLowerCase().split(" ");
    for (let i = 0; i < orders.length; i++) {
      let matchedString = false;
      for (let j = 0; j < individualStrings.length; j++) {
        let regexExpression = `^.*` + individualStrings[j] + `.*$`;
        if (
          orders[i].user_id.toLowerCase().match(regexExpression) ||
          orders[i].total_price.toString().match(regexExpression) ||
          orders[i].delivery_mode.toLowerCase().match(regexExpression) ||
          orders[i].status.toLowerCase().match(regexExpression) ||
          orders[i].id.toLowerCase().match(regexExpression)
        ) {
          matchedString = true;
          break;
        }
      }
      if (matchedString) {
        datas.push(orders[i]);
      }
    }

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Successful in getting all orders with search string",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in getting all orders with search string",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getOrderViaIdFunction = async (id: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const orderReference = doc(db, "orders", id);

    const orderSnapshot = await getDoc(orderReference);

    if (orderSnapshot.exists()) {
      resultObject = {
        result: { id: orderSnapshot.id, ...orderSnapshot.data() },
        isSuccess: true,
        resultText: "Successful in getting order information",
        errorMessage: "",
      };
    } else {
      resultObject = {
        result: data,
        isSuccess: false,
        resultText: "Order does not exist",
        errorMessage: "",
      };
    }
  } catch (e: unknown) {
    resultObject = {
      result: data,
      isSuccess: false,
      resultText: "Failed in getting order information",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const addOrderFunction = async (order: Constants.OrdersDatabaseType) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const documentRef = await addDoc(collection(db, "orders"), {
      created_at: new Date().toString(),
      updated_at: new Date().toString(),

      total_price: order.total_price,
      date_cleared: "",

      payment: order.payment,
      products: order.products,
      status: order.status,

      user_id: order.user_id,
      note: order.note,
      delivery_mode: order.delivery_mode,
      shipping_details: order.shipping_details,
    });

    const data = {
      id: documentRef.id,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),

      total_price: order.total_price,
      date_cleared: "",

      payment: order.payment,
      products: order.products,
      status: order.status,

      user_id: order.user_id,
      note: order.note,
      delivery_mode: order.delivery_mode,
      shipping_details: order.shipping_details,
    };

    resultObject = {
      result: data,
      isSuccess: true,
      resultText: "Successful in adding order",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: "",
      isSuccess: true,
      resultText: "Failed in adding order",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const updateOrderFunction = async (
  order: Constants.OrdersDatabaseType,
  orderId: string
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    await setDoc(doc(db, "orders", orderId), {
      created_at: order.created_at,
      updated_at: new Date().toString(),

      total_price: order.total_price,
      date_cleared: order.date_cleared,

      payment: order.payment,
      products: order.products,
      status: order.status,

      user_id: order.user_id,
      note: order.note,
      delivery_mode: order.delivery_mode,
      shipping_details: order.shipping_details,
    });

    //update product quantity_sold
    if (order.status == "delivered") {
      for (let i = 0; i < order.products.length; i++) {
        const currentProduct = order.products[i];
        const getProductInfo = await getProductViaIdFunction(currentProduct.id);

        if (!getProductInfo.isSuccess) {
          return (resultObject = {
            result: "",
            isSuccess: false,
            resultText: getProductInfo.resultText,
            errorMessage: getProductInfo.errorMessage,
          });
        }

        const getProductResult = getProductInfo.result;

        await setDoc(
          doc(db, "products", getProductResult.id),
          {
            quantity_left:
              parseInt(getProductResult.quantity_left) -
              currentProduct.quantity,
            quantity_sold:
              parseInt(getProductResult.quantity_sold) +
              currentProduct.quantity,
          },
          { merge: true }
        );
      }
    }

    resultObject = {
      result: orderId,
      isSuccess: true,
      resultText: "Successful in updating order",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: "",
      isSuccess: false,
      resultText: "Failed in updating order",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const deleteOrderFunction = async (orderId: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  try {
    await deleteDoc(doc(db, "orders", orderId));

    resultObject = {
      result: {},
      isSuccess: true,
      resultText: "Successful in deleting product",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: {},
      isSuccess: false,
      resultText: "Failed in deleting order",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};
