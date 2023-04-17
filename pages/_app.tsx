import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/universal";
import {
  AuthContextProvider,
  useAuthContext,
  AuthContext,
} from "@/context/AuthContext";
import Alert from "@/components/universal/alert";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Custom404 from "./404";

export default function App({ Component, pageProps }: AppProps) {
  const [appUser, setAppUser] = useState(null);
  const { user, isAuthorized } = useAuthContext();
  const authContextObject = useContext(AuthContext);

  useEffect(() => {
    setAppUser(user);
  }, [user]);

  if (pageProps.protected && pageProps.isAuthorized != isAuthorized) {
    console.log("what");
    authContextObject.error("Unauthorized access");
    return (
      <Layout>
        <Custom404 />
      </Layout>
    );
  }

  return (
    <>
      <AuthContextProvider>
        <Layout>
          <Alert />
          <Component {...pageProps} />
        </Layout>
      </AuthContextProvider>
    </>
  );
}
