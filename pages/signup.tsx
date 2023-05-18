"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { logout, useAuthContext } from "@/context/AuthContext";

import { createAccount } from "@/firebase/firebase_functions/auth_functions";
import { addUserFunction } from "@/firebase/firebase_functions/users_functions";

import WarningMessage from "@/components/forms/WarningMessage";
import SocialMediaLogin from "@/components/common/SocialMediaLogin";

export default function Signup() {
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { success, error } = useAuthContext();

  const handleForm = async (data: any, e?: any) =>
    // event: any
    {
      e.preventDefault();
      const { inputEmail, inputPassword } = data;

      const result = await createAccount(inputEmail, inputPassword);

      if (result.isSuccess) {
        const addResult = await addUserFunction({
          email: inputEmail,
          id: result.result,
        });

        if (addResult.isSuccess) {
          success(result.message);
          router.push("/");
        } else {
          error(result.message);
        }
      } else {
        error(result.message);
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
              <form onSubmit={handleSubmit(handleForm)}>
                <div className="mb-6">
                  <input
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
                  <input
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
                    aria-invalid={errors.inputPassword ? "true" : "false"}
                  />
                  {errors.inputPassword && (
                    <WarningMessage text={errors.inputPassword?.message} />
                  )}
                </div>
                <div className="">
                  <input
                    type="submit"
                    value="Sign Up"
                    className="border-primary w-full cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
                  />
                </div>
              </form>
              <SocialMediaLogin addDivider={true} />
              <p className="text-base text-[#adadad]">
                Already have an account?
                <Link
                  href="/login"
                  className="text-primary hover:underline ml-1"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
