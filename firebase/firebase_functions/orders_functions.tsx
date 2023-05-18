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
import { FunctionResult } from "../constants/function_constants";
import { parseError } from "../helpers";
import { getDocumentGivenTypeAndIdFunction } from "./general_functions";
import {
  CollectionsEnum,
  OrderStatusEnum,
  ResultTypeEnum,
} from "../constants/enum_constants";
import { OrdersDatabaseType } from "../constants/orders_constants";
import { SuccessCodes, ErrorCodes } from "../constants/success_and_error_codes";
import { ProductsDatabaseType } from "../constants/product_constants";
import { CartsDatabaseType } from "../constants/cart_constants";

export const addOrderFunction = async (order: OrdersDatabaseType) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };
  let data: OrdersDatabaseType = {} as OrdersDatabaseType;

  try {
    data = {
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

    const productInfo: any[] = [];
    let promises: any[] = [];

    for (let i = 0; i < data.products.length; i++) {
      const currentProduct = data.products[i];
      const productPromise = await getDocumentGivenTypeAndIdFunction(
        CollectionsEnum.PRODUCT,
        currentProduct.id
      ).then((value) => {
        productInfo.push(value.result);
      });
      promises.push(productPromise);
    }

    let isError = false;
    await Promise.all(promises).then(async (e) => {
      for (let i = 0; i < productInfo.length; i++) {
        const currentProductQuantity = productInfo[i].quantity_left
          ? productInfo[i].quantity_left
          : 0;
        if (currentProductQuantity < data.products[i].quantity) {
          isError = true;
          const errorMessage = `Error with product name: ${productInfo[i].name}. Remove from cart and try again.`;

          //return error
          resultObject = {
            result: data,
            resultType: ResultTypeEnum.OBJECT,
            isSuccess: false,
            message: errorMessage,
          };
          break;
        }
      }

      if (!isError) {
        const documentRef = await addDoc(collection(db, "orders"), data);

        data.id = documentRef.id;

        resultObject = {
          result: data,
          resultType: ResultTypeEnum.OBJECT,
          isSuccess: true,
          message: SuccessCodes["add-order"],
        };
      }
    });
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: data,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["add-order"],
    };
  }

  return resultObject;
};

export const updateOrderFunction = async (
  order: OrdersDatabaseType,
  orderId: string
) => {
  let resultObject: FunctionResult = {
    result: null,
    resultType: ResultTypeEnum.NULL,
    isSuccess: false,
    message: "",
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

    //todo: update product quantity_sold
    if (order.status == "delivered") {
      for (let i = 0; i < order.products.length; i++) {
        const currentProduct = order.products[i];
        const getProductInfo = await getDocumentGivenTypeAndIdFunction(
          CollectionsEnum.PRODUCT,
          currentProduct.id
        );
        const productInfo: ProductsDatabaseType =
          getProductInfo.result as ProductsDatabaseType;

        if (!getProductInfo.isSuccess) {
          return getProductInfo;
        }

        await setDoc(
          doc(db, "products", productInfo.id || ""),
          {
            quantity_left: productInfo.quantity_left - currentProduct.quantity,
            quantity_sold:
              (productInfo.quantity_sold || 0) + currentProduct.quantity,
          },
          { merge: true }
        );
      }
    }

    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: true,
      message: SuccessCodes["update-order"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["update-order"],
    };
  }

  return resultObject;
};

export const getAllPendingOrdersGivenUserId = async (userId: string) => {
  let resultObject: FunctionResult = {
    result: [],
    resultType: ResultTypeEnum.ARRAY,
    isSuccess: false,
    message: "",
  };
  let datas: OrdersDatabaseType[] = [];

  try {
    const orderReference = query(
      collection(db, "orders"),
      where("user_id", "==", userId)
    );

    const docs = await getDocs(orderReference);
    docs.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      if (data.status && data.status == OrderStatusEnum.PENDING) {
        datas.push({
          id: id,
          total_price: data.total_price,
          payment: data.payment,
          products: data.products,
          status: data.status,
          delivery_mode: data.delivery_mode,
          shipping_details: data.shipping_details,
          ...data,
        });
      }
    });

    resultObject = {
      result: datas,
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: true,
      message: SuccessCodes["user-pending-orders"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: [],
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: false,
      message: errorMessage
        ? errorMessage
        : ErrorCodes["user-pending-orders-error"],
    };
  }

  return resultObject;
};
