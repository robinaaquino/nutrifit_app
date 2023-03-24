import { useEffect, ReactNode } from "react"
import Header from "./header"
import Footer from "./footer"

export default function Layout({ children }:{ children: ReactNode }) {
  useEffect(() => {
    // console.log('layout')
  }, []);

  return(
    <>
      <div className="flex flex-col min-h-screen">
        <Header></Header>
        <main className="flex flex-col h-screen w-full bg-white">
          { children }
        </main>
        <Footer></Footer>
      </div>

    </>
  )
}