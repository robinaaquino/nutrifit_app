"use client";
import React, { useContext } from "react";
import signUp from "@/firebase/auth/signup";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function Signup() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const authContextObject = useContext(AuthContext);

  const handleForm = async (e: any) =>
    // event: any
    {
      e.preventDefault();
      const result = await signUp(email, password);

      if (result.isSuccess) {
        authContextObject.success(result.resultText);
        router.push("/login");
      } else {
        authContextObject.error(result.resultText);
      }
    };
  return (
    <>
      <div className="container mx-auto bg-[#F4F7FF] py-20 lg:py-[120px] p-10">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="relative mx-auto max-w-[525px] overflow-hidden min-h-full rounded-lg bg-white py-16 px-10 text-center sm:px-12 md:px-[60px]">
              <h2 className="mt-6 mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign up
              </h2>
              <form onSubmit={handleForm}>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Email"
                    className="bordder-[#E9EDF4] w-full rounded-md border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:border-primary focus-visible:shadow-none"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Password"
                    className="bordder-[#E9EDF4] w-full rounded-md border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:border-primary focus-visible:shadow-none"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-10">
                  <input
                    type="submit"
                    value="Sign Up"
                    className="bordder-primary w-full cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
                  />
                </div>
              </form>
              <p className="text-base text-[#adadad]">
                Already have an account?
                <a
                  href="javascript:void(0)"
                  className="text-primary hover:underline ml-1"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <div
        className="m-auto my-24 w-1/3 h-1/3 divide-y-4 space-y-1 bg-white
      "
      >
        <div className="w-full max-w-xs">
          <h1 className="text-2xl font-bold leading-7 text-black sm:truncate sm:text-3xl sm:tracking-tight">
            Create Account
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
                className="hover:bg-blue-700 text-white bg-nf_green font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                onClick={() => handleForm()}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div> */}
    </>
    //   <div className="m-auto my-24 w-1/3 h-1/3 divide-y-4 space-y-1 bg-white">
    //     <div className="w-full max-w-xs">
    //       <h1 className="text-2xl font-bold leading-7 text-black sm:truncate sm:text-3xl sm:tracking-tight">
    //         Create an Account
    //       </h1>
    //       <form action="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    //         <div className="mb-4">
    //           <label
    //             htmlFor="email"
    //             className="block text-black text-sm font-bold mb-2"
    //           >
    //             Email{" "}
    //           </label>
    //           <input
    //             name="email"
    //             type="email"
    //             onChange={(e) => setEmail(e.target.value)}
    //             className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-nf_green leading-tight"
    //           />
    //           <label
    //             htmlFor="password"
    //             className="block text-black text-sm font-bold mb-2"
    //           >
    //             Password{" "}
    //           </label>
    //           <input
    //             name="password"
    //             type="password"
    //             onChange={(e) => setPassword(e.target.value)}
    //             className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-nf_green leading-tight"
    //           />
    //         </div>
    //         <button
    //           onClick={() => handleForm()}
    //           className="bg-blue-500 hover:bg-blue-700 text-white bg-nf_green font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //         >
    //           Create account
    //         </button>
    //       </form>
    //     </div>
    //   </div>
    // );
  );
}
