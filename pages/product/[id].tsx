import { useRouter } from "next/router";
import React, { useEffect } from "react";
export default function ProductShow() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    router.replace("/maintenance");
  });
  return <>{id}</>;
}
