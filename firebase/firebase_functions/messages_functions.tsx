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
import * as Constants from "../constants";
import { FunctionResult } from "@/firebase/constants";
import { parseError } from "../helpers";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const getAllMessagesFunction = async () => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const docs = await getDocs(collection(db, "messages"));

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
      resultText: "Successful in getting all messages",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in getting all messages",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const addMessageFunction = async (message: any) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const documentRef = await addDoc(collection(db, "messages"), {
      ...message,
      status: "unread",
      updated_at: new Date().toString(),
      created_at: new Date().toString(),
    });

    resultObject = {
      result: documentRef.id,
      isSuccess: true,
      resultText: "Successful in sending message",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: "",
      isSuccess: true,
      resultText: "Failed in sending message",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getMessageFunction = async (id: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const messageReference = doc(db, "messages", id);

    const messageSnapshot = await getDoc(messageReference);

    if (messageSnapshot.exists()) {
      resultObject = {
        result: { id: messageSnapshot.id, ...messageSnapshot.data() },
        isSuccess: true,
        resultText: "Successful in getting message information",
        errorMessage: "",
      };
    } else {
      resultObject = {
        result: data,
        isSuccess: true,
        resultText: "Message does not exist",
        errorMessage: "",
      };
    }
  } catch (e: unknown) {
    resultObject = {
      result: data,
      isSuccess: true,
      resultText: "Failed in getting message information",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const updateMessageFunction = async (
  message: any,
  messageId: string
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  try {
    let messageToBeAdded: any = {
      id: messageId,
      updated_at: new Date().toString(),
      created_at: message.created_at,
      ...message,
    };

    await setDoc(doc(db, "messages", messageId), messageToBeAdded);

    resultObject = {
      result: messageToBeAdded,
      isSuccess: true,
      resultText: "Successful in updating message",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: {},
      isSuccess: false,
      resultText: "Failed in updating message",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const deleteMessageFunction = async (messageId: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  try {
    await deleteDoc(doc(db, "messages", messageId));

    resultObject = {
      result: {},
      isSuccess: true,
      resultText: "Successful in deleting message",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: {},
      isSuccess: false,
      resultText: "Failed in deleting message",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};
