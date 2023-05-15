import { resetPassword } from "@/firebase/firebase_functions/auth_functions";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useForm } from "react-hook-form";

import WarningMessage from "@/components/forms/WarningMessage";

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
      success(resetPasswordResult.resultText);
    } else {
      error(resetPasswordResult.errorMessage);
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
