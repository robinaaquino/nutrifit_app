import { useEffect } from "react"
import Header from "./header"
import Footer from "./footer"

export default function Layout({ children }:{ children: any }) {
  useEffect(() => {
    // console.log('layout')
  }, []);

  return(
    <>
      <Header></Header>
      <main className="flex flex-col h-screen">
        { children }
      </main>
      <Footer></Footer>
    </>
  )
}