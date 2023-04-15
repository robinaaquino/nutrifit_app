import app from "../config";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { functionResult } from "@/firebase/constants";

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<any> {
  let resultObject: functionResult = {
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
}
