import { db } from "../config";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import * as Constants from "../constants";
import { FunctionResult } from "@/firebase/constants";
import { parseError } from "../helpers";

export const getAllUsersFunction = async () => {
  let datas: any[] = [];
  const docs = await getDocs(collection(db, "users"));

  docs.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    datas.push({
      id,
      ...data,
    });
  });

  return datas;
};

export const addUserFunction = async (user: Constants.UsersDatabaseType) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const documentRef = await setDoc(doc(db, "users", user.id), {
      email: user.email,
      id: user.id,
      contact_number: "",
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      shipping_details: {
        address: "",
        first_name: "",
        last_name: "",
        municipality: "",
        province: "",
      },
      role: Constants.ROLE_STATES.CUSTOMER,
    });

    resultObject = {
      result: user.id,
      isSuccess: true,
      resultText: "Successful in adding customer",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: "",
      isSuccess: true,
      resultText: "Failed in adding customer",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getUserFunction = async (id: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const userReference = doc(db, "users", id);

    const userSnapshot = await getDoc(userReference);

    if (userSnapshot.exists()) {
      resultObject = {
        result: { id: userSnapshot.id, ...userSnapshot.data() },
        isSuccess: true,
        resultText: "Successful in getting user information",
        errorMessage: "",
      };
    } else {
      resultObject = {
        result: data,
        isSuccess: true,
        resultText: "User does not exist",
        errorMessage: "",
      };
    }
  } catch (e: unknown) {
    resultObject = {
      result: data,
      isSuccess: true,
      resultText: "Failed in getting user information",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const isUserAuthorizedFunction = async (id: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  try {
    const userReference = doc(db, "users", id);

    const userSnapshot = await getDoc(userReference);

    if (userSnapshot.exists()) {
      resultObject = {
        result: userSnapshot.data().role == "admin" ? true : false,
        isSuccess: true,
        resultText: "Successful in getting user authorization status",
        errorMessage: "",
      };
    } else {
      resultObject = {
        result: false,
        isSuccess: true,
        resultText: "User does not exist",
        errorMessage: "",
      };
    }
  } catch (e: unknown) {
    resultObject = {
      result: false,
      isSuccess: true,
      resultText: "Failed in getting user information",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};
