import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";

import app from "../config";
import admin from "../admin-config";

import { ResultTypeEnum } from "../constants/enum_constants";
import { FunctionResult } from "../constants/function_constants";
import { ErrorCodes, SuccessCodes } from "../constants/success_and_error_codes";

import { parseError } from "../helpers";

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Call GoogleSignIn provider to login user
export const signInWithGoogle = async (): Promise<any> => {
  let resultObject: FunctionResult = {
    result: "",
    resultType: ResultTypeEnum.TEXT,
    isSuccess: false,
    message: "",
  };

  await signInWithRedirect(auth, provider)
    .then((result: any) => {
      const userUid = result.user; //returns user uid

      resultObject = {
        //set result object for success
        result: userUid,
        resultType: ResultTypeEnum.TEXT,
        isSuccess: true,
        message: SuccessCodes["login-google"],
      };
    })
    .catch((error: any) => {
      const errorMessage = parseError(error.message); //parse error message

      resultObject = {
        //set result object for fail
        result: "",
        resultType: ResultTypeEnum.TEXT,
        isSuccess: false,
        message: errorMessage ? errorMessage : ErrorCodes["login-google"],
      };
    });

  return resultObject;
};

// Login user using email and password
export const logInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  let resultObject: FunctionResult = {
    result: "",
    resultType: ResultTypeEnum.TEXT,
    isSuccess: false,
    message: "",
  };

  await signInWithEmailAndPassword(auth, email, password) //call Firebase function to login using email and password
    .then((result: any) => {
      const userUid = result.user.uid; //get user uid

      resultObject = {
        //set result for success
        result: userUid,
        resultType: ResultTypeEnum.TEXT,
        isSuccess: true,
        message: SuccessCodes["login-email"],
      };
    })
    .catch((error: any) => {
      const errorMessage = parseError(error);

      resultObject = {
        result: "",
        resultType: ResultTypeEnum.TEXT,
        isSuccess: false,
        message: errorMessage ? errorMessage : ErrorCodes["login-email"],
      };
    });

  return resultObject;
};

// Create an account using email and password
export const createAccount = async (email: string, password: string) => {
  let resultObject: FunctionResult = {
    result: "",
    resultType: ResultTypeEnum.TEXT,
    isSuccess: false,
    message: "",
  };

  await createUserWithEmailAndPassword(auth, email, password).then(
    async (result: any) => {
      const userUid = result.user.uid;

      await sendEmailVerification(result.user)
        .then((user: any) => {
          resultObject = {
            result: userUid,
            resultType: ResultTypeEnum.TEXT,
            isSuccess: true,
            message: SuccessCodes["email-verification"],
          };
        })
        .catch((error: any) => {
          const errorMessage = parseError(error);

          resultObject = {
            result: "",
            resultType: ResultTypeEnum.TEXT,
            isSuccess: false,
            message: errorMessage
              ? errorMessage
              : ErrorCodes["email-verification"],
          };
        });
    }
  );
  return resultObject;
};

// Send a reset password link given email
export const resetPassword = async (email: string) => {
  let resultObject: FunctionResult = {
    result: null,
    resultType: ResultTypeEnum.NULL,
    isSuccess: false,
    message: "",
  };

  await sendPasswordResetEmail(auth, email)
    .then(() => {
      resultObject = {
        result: null,
        resultType: ResultTypeEnum.NULL,
        isSuccess: true,
        message: SuccessCodes["reset-password"],
      };
    })
    .catch((error: any) => {
      const errorMessage = parseError(error);

      return (resultObject = {
        result: "",
        resultType: ResultTypeEnum.TEXT,
        isSuccess: false,
        message: errorMessage ? errorMessage : ErrorCodes["signup-email"],
      });
    });

  return resultObject;
};
