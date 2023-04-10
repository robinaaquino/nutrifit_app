import app from "../config";
import { auth } from "./auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { functionResult } from "@/constants/constants";

export default async function signUp(email: string, password: string) {
  let result: functionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  await createUserWithEmailAndPassword(auth, email, password)
    .then((result: any) => {
      const user = result.user;

      result = {
        result: user,
        isSuccess: true,
        resultText: "Successful in signing up in via email",
        errorMessage: "",
      };
    })
    .catch((error: any) => {
      const errorMessage = error.message;

      result = {
        result: "",
        isSuccess: false,
        resultText: "Failed in signing up via email",
        errorMessage: errorMessage,
      };
    });

  return result;
}
