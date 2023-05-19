import { signInWithGoogle } from "@/firebase/firebase_functions/auth_functions";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function GoogleSignInButton() {
  const { success } = useAuthContext();
  const router = useRouter();

  const handleFormGoogle = async () => {
    await signInWithGoogle();
    success("Successful in logging in");
    router.push("/");
  };

  return (
    <>
      <button
        onClick={() => handleFormGoogle()}
        className="flex h-11 items-center justify-center rounded-md bg-[#D64937] hover:bg-opacity-90 w-full"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.8477 8.17132H9.29628V10.643H15.4342C15.1065 14.0743 12.2461 15.5574 9.47506 15.5574C5.95916 15.5574 2.8306 12.8821 2.8306 9.01461C2.8306 5.29251 5.81018 2.47185 9.47506 2.47185C12.2759 2.47185 13.9742 4.24567 13.9742 4.24567L15.7024 2.47185C15.7024 2.47185 13.3783 0.000145544 9.35587 0.000145544C4.05223 -0.0289334 0 4.30383 0 8.98553C0 13.5218 3.81386 18 9.44526 18C14.4212 18 17.9967 14.7141 17.9967 9.79974C18.0264 8.78198 17.8477 8.17132 17.8477 8.17132Z"
            fill="white"
          />
        </svg>
        <span className="ml-3 text-white">Google</span>
      </button>
    </>
  );
}
