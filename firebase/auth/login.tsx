import app from "../config";
import { auth } from "./auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { functionResult } from "@/constants/constants";

//TODO: turn alert and redirects in the function
export default async function logInWithEmailAndPassword(
  email: string,
  password: string
) {
  let resultObject: functionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  await signInWithEmailAndPassword(auth, email, password)
    .then((result: any) => {
      const user = result.user;

      resultObject = {
        result: user,
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
}
