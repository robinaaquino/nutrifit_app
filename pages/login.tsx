"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { useAuthContext } from "@/context/AuthContext";

import { CollectionsEnum } from "@/firebase/constants/enum_constants";

import { getDocumentGivenTypeAndIdFunction } from "@/firebase/firebase_functions/general_functions";
import { logInWithEmailAndPassword } from "@/firebase/firebase_functions/auth_functions";

import SocialMediaLogin from "@/components/common/SocialMediaLogin";
import InputComponent from "@/components/forms/input/InputComponent";
import InputSubmit from "@/components/forms/input/InputSubmit";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user, success, error } = useAuthContext();

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

  const handleForm = async (data: any, e: any) =>
    // event: any
    {
      e.preventDefault();
      const { inputEmail, inputPassword } = data;
      const result = await logInWithEmailAndPassword(inputEmail, inputPassword);

      if (result.isSuccess) {
        const getUserResult = await getDocumentGivenTypeAndIdFunction(
          CollectionsEnum.USER,
          result.result
        );

        if (getUserResult.isSuccess) {
          success(result.message);
          router.push("/");
        }
      } else {
        error(result.message);
      }
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
                <InputComponent
                  id="email"
                  name="inputEmail"
                  type="text"
                  label="Email"
                  placeholder="Type your email..."
                  value={email}
                  register={register}
                  rules={{
                    required: "Email address is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/,
                      message: "Please, enter a valid email address",
                    },
                    onChange: (e: any) => setEmail(e.target.value),
                  }}
                  error={errors}
                />
                <div className="mb-6">
                  <InputComponent
                    id="password"
                    name="inputPassword"
                    type="password"
                    label="Password"
                    placeholder="Type your password..."
                    value={password}
                    register={register}
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message:
                          "Password should have a minimum of 8 characters",
                      },
                      onChange: (e: any) => setPassword(e.target.value),
                    }}
                    error={errors}
                  />
                </div>
                <InputSubmit label={"Sign In"} />
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
