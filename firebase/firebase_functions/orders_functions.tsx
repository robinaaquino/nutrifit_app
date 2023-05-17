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
import { CollectionsEnum, ResultTypeEnum } from "../constants/enum_constants";
import { OrdersDatabaseType } from "../constants/orders_constants";
import { SuccessCodes, ErrorCodes } from "../constants/success_and_error_codes";
import { ProductsDatabaseType } from "../constants/product_constants";

export const addOrderFunction = async (order: OrdersDatabaseType) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };
  let data: OrdersDatabaseType = {} as OrdersDatabaseType;

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
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: true,
      message: SuccessCodes["add-order"],
    };
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
