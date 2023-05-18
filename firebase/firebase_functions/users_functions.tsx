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

import { ResultTypeEnum, RoleEnum } from "../constants/enum_constants";
import { UsersDatabaseType } from "../constants/user_constants";
import { FunctionResult } from "../constants/function_constants";
import { parseError } from "../helpers";
import { ErrorCodes, SuccessCodes } from "../constants/success_and_error_codes";

// Get user information given email
export const getUserViaEmailFunction = async (email: string) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };
  let data: UsersDatabaseType = {
    id: "",
    email: "",
    contact_number: "",
    created_at: "",
    updated_at: "",
    role: RoleEnum.CUSTOMER,
    shipping_details: {
      address: "",
      first_name: "",
      last_name: "",
      city: "",
      province: "",
      contact_number: "",
    },
    image: "",
  };

  try {
    const userReference = query(
      collection(db, "users"),
      where("email", "==", email)
    );

    const userSnapshot = await getDocs(userReference);

    var foundInfo = false;
    userSnapshot.forEach((doc) => {
      const id = doc.id;
      const information = doc.data();
      data = {
        id,
        email: information.email,
        ...information,
      };
      foundInfo = true;
    });

    if (!foundInfo) {
      resultObject = {
        result: {},
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: true,
        message: SuccessCodes["get-user-does-not-exist"],
      };
      return resultObject;
    }

    resultObject = {
      result: data,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: true,
      message: SuccessCodes["get-user"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: {},
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["get-user-given-email"],
    };
  }

  return resultObject;
};

// Add a user
export const addUserFunction = async (user: UsersDatabaseType) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };
  let data: UsersDatabaseType = {} as UsersDatabaseType;

  try {
    data = {
      email: user.email,
      id: user.id,
      contact_number: "",
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      shipping_details: {
        contact_number: "",
        address: "",
        first_name: "",
        last_name: "",
        city: "",
        province: "",
      },
      role: RoleEnum.CUSTOMER,
    };

    await setDoc(doc(db, "users", user.id), data);

    resultObject = {
      result: data,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: SuccessCodes["add-user"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: data,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["add-user"],
    };
  }

  return resultObject;
};

// Update user information
export const updateUserFunction = async (
  user: UsersDatabaseType,
  userId: string
) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };

  try {
    let userToBeAdded: UsersDatabaseType = {
      id: userId,
      updated_at: new Date().toString(),
      created_at: user.created_at,
      email: user.email,
      role: user.role,
      shipping_details: user.shipping_details,
      image: user.image ? user.image : "",
    };

    const storageRef = ref(storage, `/users/${userId}`);
    if (user.image && user.image instanceof File && user.image.name) {
      await uploadBytes(storageRef, user.image, {
        contentType: user.image["type"],
      }).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((url: any) => {
          userToBeAdded.image = url;
        });
      });
    }

    await setDoc(doc(db, "users", userId), userToBeAdded);

    resultObject = {
      result: userToBeAdded,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: true,
      message: SuccessCodes["update-user"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: {},
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["update-user"],
    };
  }

  return resultObject;
};

// Check if user is authorized
export const isUserAuthorizedFunction = async (id: string) => {
  let resultObject: FunctionResult = {
    result: false,
    resultType: ResultTypeEnum.BOOLEAN,
    isSuccess: false,
    message: "",
  };

  try {
    const userReference = doc(db, "users", id);

    const userSnapshot = await getDoc(userReference);

    if (userSnapshot.exists()) {
      resultObject = {
        result: userSnapshot.data().role == "admin" ? true : false,
        resultType: ResultTypeEnum.BOOLEAN,
        isSuccess: true,
        message: SuccessCodes["user-authorized"],
      };
    } else {
      resultObject = {
        result: false,
        resultType: ResultTypeEnum.BOOLEAN,
        isSuccess: true,
        message: SuccessCodes["get-user-does-not-exist"],
      };
    }
  } catch (e: unknown) {
    const errorMessage = parseError(e);
    resultObject = {
      result: false,
      resultType: ResultTypeEnum.BOOLEAN,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["user-authorized"],
    };
  }

  return resultObject;
};
