import { useRouter } from "next/router";

export default function OrderShow() {
  const router = useRouter();
  const { id } = router.query;
  return <>{id}</>;
}
