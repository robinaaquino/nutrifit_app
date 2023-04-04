"use client";
import React, { useEffect } from "react";
import login from "@/firebase/auth/login";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const handleForm = async () =>
    // event: any
    {
      const { result, error } = await login(email, password);

      if (error) {
        return console.log("Failed to login");
      }

      // else successful
      router.replace("/");
      console.log("Successfully logged in");
    };

  useEffect(() => {
    console.log("login");
  }, []);
  return (
    <div
      className="m-auto my-24 w-1/3 h-1/3 divide-y-4 space-y-1 bg-white
      "
    >
      <div className="w-full max-w-xs">
        <h1 className="text-2xl font-bold leading-7 text-black sm:truncate sm:text-3xl sm:tracking-tight">
          Login
        </h1>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-black text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-nf_green leading-tight"
              id="email"
              type="text"
              required
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-black text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-nf_green mb-3 leading-tight"
              id="password"
              type="password"
              required
              minLength={6}
              maxLength={255}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white bg-nf_green font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={() => handleForm()}
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/forgot_password"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
