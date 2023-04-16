import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect } from "react";

export default function Catalog() {
  const authContextObject = useContext(AuthContext);

  useEffect(() => {
    console.log(authContextObject);
  });
  return <>catalog</>;
}
