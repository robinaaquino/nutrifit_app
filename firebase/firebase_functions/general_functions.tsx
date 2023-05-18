import { db, storage } from "../config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  ResultTypeEnum,
  RoleEnum,
  CollectionsEnum,
} from "../constants/enum_constants";
import { UsersDatabaseType } from "../constants/user_constants";
import { FunctionResult } from "../constants/function_constants";
import { parseError } from "../helpers";
import { ErrorCodes, SuccessCodes } from "../constants/success_and_error_codes";
import { ProductsDatabaseType } from "../constants/product_constants";
import { MessagesDatabaseType } from "../constants/messages_constants";
import { OrdersDatabaseType } from "../constants/orders_constants";
import { WellnessDatabaseType } from "../constants/wellness_constants";
import { getAllPendingOrdersGivenUserId } from "./orders_functions";

export const getAllDocumentsGivenTypeFunction = async (
  type: CollectionsEnum
) => {
  let resultObject: FunctionResult = {
    result: [],
    resultType: ResultTypeEnum.ARRAY,
    isSuccess: false,
    message: "",
  };
  let datas: any[] = [];

  try {
    if (type == CollectionsEnum.ORDER) {
      const docs = await getDocs(collection(db, "orders"));

      docs.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        datas.push({
          id,
          ...data,
        });
      });

      for (let i = 0; i < datas.length; i++) {
        let currentData = datas[i];
        if (currentData.user_id) {
          const userDataResult = await getDocumentGivenTypeAndIdFunction(
            CollectionsEnum.ORDER,
            currentData.user_id
          );

          if (!userDataResult.isSuccess) {
            return userDataResult;
          }

          const userInformation: UsersDatabaseType =
            userDataResult.result as UsersDatabaseType;

          currentData["email"] = userInformation.email;
        } else {
          currentData["email"] = "Guest";
        }

        if (currentData.shipping_details) {
          currentData["first_name"] = currentData.shipping_details.first_name;
          currentData["last_name"] = currentData.shipping_details.last_name;
        }
      }
    } else {
      const docs = await getDocs(collection(db, type));

      docs.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        datas.push({
          id,
          ...data,
        });
      });
    }

    resultObject = {
      result: datas,
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: true,
      message: SuccessCodes["get-all-documents"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: datas,
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["get-all-documents"],
    };
  }

  return resultObject;
};

export const getAllDocumentsGivenTypeAndUserIdFunction = async (
  type: CollectionsEnum,
  userId: string
) => {
  let resultObject: FunctionResult = {
    result: [],
    resultType: ResultTypeEnum.ARRAY,
    isSuccess: false,
    message: "",
  };
  let datas: any[] = [];

  try {
    const docs = await getDocs(collection(db, type));

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
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: true,
      message: SuccessCodes["get-all-documents-given-user-id"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: datas,
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: false,
      message: errorMessage
        ? errorMessage
        : ErrorCodes["get-all-documents-given-user-id"],
    };
  }

  return resultObject;
};

export const getDocumentGivenTypeAndIdFunction = async (
  type: CollectionsEnum,
  id: string
) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };
  let data:
    | ProductsDatabaseType
    | UsersDatabaseType
    | MessagesDatabaseType
    | WellnessDatabaseType = {} as
    | ProductsDatabaseType
    | UsersDatabaseType
    | MessagesDatabaseType
    | WellnessDatabaseType;

  try {
    const documentReference = doc(db, type, id);

    const documentSnapshot = await getDoc(documentReference);

    if (documentSnapshot.exists()) {
      const id = documentSnapshot.id;
      const information = documentSnapshot.data();

      resultObject = {
        result: {
          id,
          ...information,
        },
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: true,
        message: SuccessCodes["get-document"],
      };
    } else {
      resultObject = {
        result: data,
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: true,
        message: SuccessCodes["document-does-not-exist"],
      };
    }
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: {},
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["get-document"],
    };
  }

  return resultObject;
};

export const deleteDocumentGivenTypeAndIdFunction = async (
  type: CollectionsEnum,
  id: string
) => {
  let resultObject: FunctionResult = {
    result: null,
    resultType: ResultTypeEnum.NULL,
    isSuccess: false,
    message: "",
  };

  try {
    if (type == CollectionsEnum.USER) {
      const userPendingOrders = await getAllPendingOrdersGivenUserId(id);
      if (!userPendingOrders.isSuccess) {
        return userPendingOrders;
      }

      if (userPendingOrders.result.length > 0) {
        resultObject = {
          result: null,
          resultType: ResultTypeEnum.NULL,
          isSuccess: false,
          message: ErrorCodes["user-pending-orders"],
        };
      } else {
        await deleteDoc(doc(db, type, id));

        resultObject = {
          result: null,
          resultType: ResultTypeEnum.NULL,
          isSuccess: true,
          message: SuccessCodes.delete,
        };
      }
    } else {
      await deleteDoc(doc(db, type, id));

      resultObject = {
        result: null,
        resultType: ResultTypeEnum.NULL,
        isSuccess: true,
        message: SuccessCodes.delete,
      };
    }
  } catch (e: unknown) {
    const errorMessage = parseError(e);
    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes.delete,
    };
  }

  return resultObject;
};
