import { useRouter } from "next/router";
export default function ProductShow() {
  const router = useRouter();
  const { id } = router.query;
  return <>{id}</>;
}
