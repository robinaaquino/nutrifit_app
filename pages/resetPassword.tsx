import { useState } from "react";
import { useForm } from "react-hook-form";

import { useAuthContext } from "@/context/AuthContext";

import { resetPassword } from "@/firebase/firebase_functions/auth_functions";

import WarningMessage from "@/components/forms/WarningMessage";
import InputComponent from "@/components/forms/input/InputComponent";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const { success, error } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      inputEmail: "",
    },
  });

  const handleResetPassword = async (data: any, e?: any) => {
    e.preventDefault();

    const { inputEmail } = data;
    const resetPasswordResult = await resetPassword(inputEmail);
    if (resetPasswordResult.isSuccess) {
      success(resetPasswordResult.message);
    } else {
      error(resetPasswordResult.message);
    }
  };

  return (
    <>
      <div className="container mx-auto bg-[#F4F7FF] py-20 lg:py-[120px] p-10">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="relative mx-auto max-w-[525px] overflow-hidden min-h-full rounded-lg bg-white py-16 px-10 text-center sm:px-12 md:px-[60px]">
              <h2 className="mt-6 mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
                Reset password
              </h2>
              <form onSubmit={handleSubmit(handleResetPassword)}>
                <div className="mb-6">
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
                </div>

                <div className="">
                  <input
                    type="submit"
                    value="Reset password"
                    className="border-primary w-full cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
