import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/universal";
import { AuthContextProvider } from "@/context/AuthContext";
import Alert from "@/components/universal/alert";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
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
