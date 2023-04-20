import app from "../config";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FunctionResult } from "@/firebase/constants";

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<any> => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  await signInWithRedirect(auth, provider)
    .then((result: any) => {
      const credential: any = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      resultObject = {
        result: user,
        isSuccess: true,
        resultText: "Successful in logging in via Google",
        errorMessage: "",
      };
    })
    .catch((error: any) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);

      resultObject = {
        result: "",
        isSuccess: false,
        resultText: "Failed in logging in via Google",
        errorMessage: errorMessage,
      };
    });

  return resultObject;
};

//TODO: turn alert and redirects in the function
export const logInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  await signInWithEmailAndPassword(auth, email, password)
    .then((result: any) => {
      const userUid = result.user.uid;

      resultObject = {
        result: userUid,
        isSuccess: true,
        resultText: "Successful in logging in via email",
        errorMessage: "",
      };
    })
    .catch((error: any) => {
      const errorMessage = error.message;

      resultObject = {
        result: "",
        isSuccess: false,
        resultText: "Failed in logging in via email",
        errorMessage: errorMessage,
      };
    });

  return resultObject;
};

export const signUp = async (email: string, password: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  await createUserWithEmailAndPassword(auth, email, password)
    .then((result: any) => {
      const userUid = result.user.uid;

      resultObject = {
        result: userUid,
        isSuccess: true,
        resultText: "Successful in signing up in via email",
        errorMessage: "",
      };
    })
    .catch((error: any) => {
      const errorMessage = error.message;

      resultObject = {
        result: "",
        isSuccess: false,
        resultText: "Failed in signing up via email",
        errorMessage: errorMessage,
      };
    });

  return resultObject;
};
