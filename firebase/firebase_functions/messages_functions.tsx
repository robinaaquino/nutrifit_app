import { db, storage } from "../config";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";

import { ResultTypeEnum } from "../constants/enum_constants";
import { FunctionResult } from "../constants/function_constants";
import { parseError } from "../helpers";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { SuccessCodes, ErrorCodes } from "../constants/success_and_error_codes";
import { MessagesDatabaseType } from "../constants/messages_constants";

export const addMessageFunction = async (message: any) => {
  let resultObject: FunctionResult = {
    result: null,
    resultType: ResultTypeEnum.NULL,
    isSuccess: false,
    message: "",
  };

  try {
    await addDoc(collection(db, "messages"), {
      ...message,
      status: "unread",
      updated_at: new Date().toString(),
      created_at: new Date().toString(),
    });

    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: true,
      message: SuccessCodes["add-message"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);
    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["add-message"],
    };
  }

  return resultObject;
};

export const updateMessageFunction = async (
  message: MessagesDatabaseType,
  messageId: string
) => {
  let resultObject: FunctionResult = {
    result: null,
    resultType: ResultTypeEnum.NULL,
    isSuccess: false,
    message: "",
  };

  try {
    let messageToBeAdded: MessagesDatabaseType = {
      id: messageId,
      updated_at: new Date().toString(),
      created_at: message.created_at,
      ...message,
    };

    await setDoc(doc(db, "messages", messageId), messageToBeAdded);

    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: true,
      message: SuccessCodes["update-message"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["update-message"],
    };
  }

  return resultObject;
};
