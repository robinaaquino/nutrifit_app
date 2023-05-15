import { useEffect, ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {}, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header></Header>
        <main className="flex flex-col w-full bg-white min-h-screen">
          {children}
        </main>
        <Footer></Footer>
      </div>
    </>
  );
}
