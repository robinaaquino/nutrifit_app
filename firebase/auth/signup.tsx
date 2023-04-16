import app from "../config";
import { auth } from "./auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FunctionResult } from "@/firebase/constants";

export default async function signUp(email: string, password: string) {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  await createUserWithEmailAndPassword(auth, email, password)
    .then((result: any) => {
      const user = result.user;

      resultObject = {
        result: user,
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
}
