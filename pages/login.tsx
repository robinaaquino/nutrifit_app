"use client";
import React, { useEffect, useContext, useState } from "react";
import { logInWithEmailAndPassword } from "@/firebase/firebase_functions/auth";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/firebase/firebase_functions/auth";
import Image from "next/image";
import { AuthContext, useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { getAuth } from "firebase/auth";
import { getUserFunction } from "@/firebase/firebase_functions/users_function";
import { useForm } from "react-hook-form";
import WarningMessage from "@/components/forms/WarningMessage";
import SocialMediaLogin from "@/components/common/SocialMediaLogin";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const { user, success, error } = useAuthContext();
  const [capsLock, setCapsLock] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      inputEmail: "",
      inputPassword: "",
    },
  });

  const checkCapsLock = (event: any) => {
    if (event.getModifierState("CapsLock")) {
      setCapsLock(true);
    } else {
      setCapsLock(false);
    }
    console.log(capsLock);
    console.log("MLEM");
  };

  const changePasswordVisibility = () => {
    var passwordElement: HTMLScriptElement | null = document.getElementById(
      "password"
    ) as HTMLScriptElement;
    if (passwordElement.type == "password") {
      passwordElement.type = "text";
      setPasswordVisible(true);
    } else {
      passwordElement.type = "password";
      setPasswordVisible(false);
    }
    console.log(passwordVisible);
  };

  const handleForm = async (data: any, e: any) =>
    // event: any
    {
      e.preventDefault();
      const { inputEmail, inputPassword } = data;
      const result = await logInWithEmailAndPassword(inputEmail, inputPassword);

      if (result.isSuccess) {
        const getUserResult = await getUserFunction(result.result);

        if (getUserResult.isSuccess) {
          success(result.resultText);
          router.push("/");
        }
      } else {
        error(result.resultText);
      }
    };

  const handleFormGoogle = async () =>
    // event: any
    {
      await signInWithGoogle();
      success("Successful in logging in");
      router.push("/");
    };

  useEffect(() => {
    if (user) {
      router.push("/");
      success("Successfully logged in");
    }
  }, [user]);
  return (
    <>
      <div className="container mx-auto bg-[#F4F7FF] py-20 lg:py-[120px] p-10">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="relative mx-auto max-w-[525px] overflow-hidden min-h-full rounded-lg bg-white py-16 px-10 text-center sm:px-12 md:px-[60px]">
              <h2 className="mt-6 mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
                Log in
              </h2>
              <form onSubmit={handleSubmit(handleForm)}>
                <div className="mb-6">
                  <input
                    id="email"
                    type="text"
                    placeholder="Type your email..."
                    className="w-full rounded-md bg-gray-200 py-3 px-5 text-base text-black placeholder-gray-500 outline-none border-none  focus:border-nf_green focus-visible:shadow-none"
                    {...register("inputEmail", {
                      required: "Email address is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/,
                        message: "Please, enter a valid email address",
                      },
                      onChange: (e) => setEmail(e.target.value),
                    })}
                    aria-invalid={errors.inputEmail ? "true" : "false"}
                  />
                  {errors.inputEmail && (
                    <WarningMessage text={errors.inputEmail?.message} />
                  )}
                </div>
                <div className="mb-6">
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      placeholder="Type your password..."
                      className="w-full rounded-md bg-gray-200 py-3 px-5 text-base text-black placeholder-gray-500 outline-none border-none  focus:border-nf_green focus-visible:shadow-none"
                      {...register("inputPassword", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message:
                            "Password should have a minimum of 8 characters",
                        },
                        onChange: (e: any) => setPassword(e.target.value),
                      })}
                      onKeyUp={(e: any) => checkCapsLock(e)}
                      aria-invalid={errors.inputPassword ? "true" : "false"}
                    />
                    <div className="absolute right-0 top-0">
                      <button
                        type="button"
                        onClick={() => changePasswordVisibility()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          className={
                            passwordVisible
                              ? " bi bi-eye mr-12 mt-3 cursor-pointer text-black"
                              : "bi bi-eye mr-12 mt-3 cursor-pointer"
                          }
                          viewBox="0 0 16 16"
                        >
                          {passwordVisible ? (
                            <>
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                            </>
                          ) : (
                            <>
                              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                              <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                            </>
                          )}
                        </svg>
                      </button>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className={
                          capsLock
                            ? "bi bi-capslock absolute top-0 right-0 mr-3 mt-3 text-black"
                            : "bi bi-capslock absolute top-0 right-0 mr-3 mt-3"
                        }
                        viewBox="0 0 16 16"
                      >
                        {capsLock ? (
                          <path d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM4.5 13.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1z" />
                        ) : (
                          <path
                            fill-rule="evenodd"
                            d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM14.346 8.5 8 1.731 1.654 8.5H4.5a1 1 0 0 1 1 1v1h5v-1a1 1 0 0 1 1-1h2.846zm-9.846 5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1zm6 0h-5v1h5v-1z"
                          />
                        )}
                      </svg>
                    </div>
                  </div>

                  {errors.inputPassword && (
                    <WarningMessage text={errors.inputPassword?.message} />
                  )}
                </div>
                <div className="mb-10">
                  <input
                    type="submit"
                    value="Sign In"
                    className="border-primary w-full cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
                  />
                </div>
              </form>
              <SocialMediaLogin addDivider={true} />
              <p className="text-base text-[#adadad]">
                Forgot password?
                <Link
                  href="/resetPassword"
                  className="text-primary hover:underline"
                >
                  {" "}
                  Reset here
                </Link>
              </p>
              <p className="text-base text-[#adadad]">
                Not a member yet?
                <Link href="/signup" className="text-primary hover:underline">
                  {" "}
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
