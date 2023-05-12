import nookies from "nookies";
import admin from "@/firebase/admin-config";
import {
  getUserFunction,
  updateUserFunction,
} from "@/firebase/firebase_functions/users_function";
import { useAuthContext } from "@/context/AuthContext";
import no_image from "../../public/no_image.png";
import Image from "next/image";
import { UsersDatabaseType, RoleEnum } from "@/firebase/constants";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { resetPassword } from "@/firebase/firebase_functions/auth";
import { getAllOrdersViaIdFunction } from "@/firebase/firebase_functions/orders_functions";
import { getAllWellnessSurveyResultsViaIdFunction } from "@/firebase/firebase_functions/wellness_function";
import TableComponent from "@/components/admin/TableComponent";

import { useForm } from "react-hook-form";
import WarningMessage from "@/components/forms/WarningMessage";

export default function UserShow(props: any) {
  const router = useRouter();
  const { id } = router.query;
  const { error, success, user } = useAuthContext();
  const [userInfo, setUserInfo] = useState<UsersDatabaseType>({
    id: "",
    contact_number: "",
    created_at: "",
    updated_at: "",
    email: "",
    role: RoleEnum.CUSTOMER,
    shipping_details: {
      address: "",
      first_name: "",
      last_name: "",
      city: "",
      province: "",
      contact_number: "",
    },
    image: "",
  });
  const [image, setImage] = useState<any>();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  const [orders, setOrders] = useState([]);
  const orderHeaders = ["ID", "Status", "Date ordered", "Total Price"];
  const orderKeys = ["id", "status", "created_at", "total_price"];

  const [wellnessSurveyResult, setWellnessSurveyResults] = useState([]);
  const wellnessSurveyResultHeaders = ["ID", "Status", "Program"];
  const wellnessSurveyResultKeys = ["id", "reviewed_by_admin", "program"];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      inputFirstName: "",
      inputLastName: "",
      inputContactNumber: "",
      inputAddress: "",
      inputCity: "",
      inputProvince: "",
    },
  });

  async function fetchUser() {
    var idInput = "";
    if (id) {
      if (id[0]) {
        idInput = id.toString();
      } else if (typeof id == "string") {
        idInput = id;
      }
    }

    const result = await getUserFunction(idInput);

    if (!result.isSuccess) {
      error(result.resultText);
      router.push("/");
    } else {
      if (props.authorized) {
        setUserInfo(result.result);

        setFirstName(result.result.shipping_details?.first_name || "");
        setLastName(result.result.shipping_details?.last_name || "");
        setContactNumber(result.result.shipping_details?.contact_number || "");
        setAddress(result.result.shipping_details?.address || "");
        setCity(result.result.shipping_details?.city || "");
        setProvince(result.result.shipping_details?.province || "");

        setValue(
          "inputFirstName",
          result.result.shipping_details?.first_name || ""
        );
        setValue(
          "inputLastName",
          result.result.shipping_details?.last_name || ""
        );
        setValue(
          "inputContactNumber",
          result.result.shipping_details?.contact_number || ""
        );
        setValue("inputAddress", result.result.shipping_details?.address || "");
        setValue("inputCity", result.result.shipping_details?.city || "");
        setValue(
          "inputProvince",
          result.result.shipping_details?.province || ""
        );

        setImage(result.result.image);
      } else {
        if (idInput != user) {
          error("Unauthorized viewing");
          router.push("/");
        } else {
          setUserInfo(result.result);

          setFirstName(result.result.shipping_details?.first_name || "");
          setLastName(result.result.shipping_details?.last_name || "");
          setContactNumber(
            result.result.shipping_details?.contact_number || ""
          );
          setAddress(result.result.shipping_details?.address || "");
          setCity(result.result.shipping_details?.city || "");
          setProvince(result.result.shipping_details?.province || "");

          setValue(
            "inputFirstName",
            result.result.shipping_details?.first_name || ""
          );
          setValue(
            "inputLastName",
            result.result.shipping_details?.last_name || ""
          );
          setValue(
            "inputContactNumber",
            result.result.shipping_details?.contact_number || ""
          );
          setValue(
            "inputAddress",
            result.result.shipping_details?.address || ""
          );
          setValue("inputCity", result.result.shipping_details?.city || "");
          setValue(
            "inputProvince",
            result.result.shipping_details?.province || ""
          );

          setImage(result.result.image);
        }
      }
    }
  }

  async function fetchOrder() {
    var idInput = "";
    if (id) {
      if (id[0]) {
        idInput = id.toString();
      } else if (typeof id == "string") {
        idInput = id;
      }
    }

    const result = await getAllOrdersViaIdFunction(idInput);

    if (result.isSuccess) {
      setOrders(result.result);
    } else {
      error("result.errorMessage");
    }

    const surveyResults = await getAllWellnessSurveyResultsViaIdFunction(
      idInput
    );

    console.log("survye", surveyResults);
    if (surveyResults.isSuccess) {
      setWellnessSurveyResults(surveyResults.result);
    } else {
      error("surveyResults.errorMessage");
    }
  }

  //change image functions for user
  const handleIndividualFile = (e: any) => {
    let file = e.target.files;

    let previousImage = userInfo.image;

    if (file[0].name) {
      const fileType = file[0]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        previousImage = file[0];
      } else {
        error("Only images accepted");
      }
    } else {
      previousImage = file[0];
    }

    setImage(previousImage);
  };

  const removeIndividualImage = () => {
    setImage("");
  };

  const handleForm = async (data: any, e: any) => {
    e.preventDefault();
    const {
      inputFirstName,
      inputLastName,
      inputAddress,
      inputCity,
      inputContactNumber,
      inputProvince,
    } = data;

    var idInput = "";
    if (id) {
      if (id[0]) {
        idInput = id.toString();
      } else if (typeof id == "string") {
        idInput = id;
      }
    }

    const newInfo: UsersDatabaseType = {
      id: userInfo.id,
      contact_number: userInfo.contact_number,
      created_at: userInfo.created_at,
      updated_at: new Date().toString(),
      email: userInfo.email,
      role: userInfo.role,
      shipping_details: {
        address:
          (inputAddress ? inputAddress : userInfo.shipping_details?.address) ||
          "",
        first_name:
          (inputFirstName
            ? inputFirstName
            : userInfo.shipping_details?.first_name) || "",
        last_name:
          (inputLastName
            ? inputLastName
            : userInfo.shipping_details?.last_name) || "",
        city: (inputCity ? inputCity : userInfo.shipping_details?.city) || "",
        province:
          (inputProvince
            ? inputProvince
            : userInfo.shipping_details?.province) || "",
        contact_number:
          (inputContactNumber
            ? inputContactNumber
            : userInfo.shipping_details?.contact_number) || "",
      },
      image: image,
    };

    const result = await updateUserFunction(newInfo, idInput);

    if (result.isSuccess) {
      success(result.resultText);
      setUserInfo(result.result);
    } else {
      error(result.errorMessage);
    }
  };

  const handleResetPassword = async () => {
    const resetPasswordResult = await resetPassword(userInfo.email);
    if (resetPasswordResult.isSuccess) {
      success(resetPasswordResult.resultText);
    } else {
      error(resetPasswordResult.errorMessage);
    }
  };

  const discardChanges = async (e: any) => {
    e.preventDefault();
    (document.getElementById("grid-first-name") as HTMLInputElement).value = "";
    (document.getElementById("grid-last-name") as HTMLInputElement).value = "";
    (document.getElementById("grid-contact-number") as HTMLInputElement).value =
      "";
    (document.getElementById("grid-address") as HTMLInputElement).value = "";
    (document.getElementById("grid-city") as HTMLInputElement).value = "";
    (document.getElementById("grid-province") as HTMLInputElement).value = "";
  };

  useEffect(() => {
    if (props.isAuthorized || (id == props.user && props.userDetails)) {
      setUserInfo(props.userDetails);

      setFirstName(props.userDetails.shipping_details?.first_name || "");
      setLastName(props.userDetails.shipping_details?.last_name || "");
      setContactNumber(
        props.userDetails.shipping_details?.contact_number || ""
      );
      setAddress(props.userDetails.shipping_details?.address || "");
      setCity(props.userDetails.shipping_details?.city || "");
      setProvince(props.userDetails.shipping_details?.province || "");

      setValue(
        "inputFirstName",
        props.userDetails.shipping_details?.first_name || ""
      );
      setValue(
        "inputLastName",
        props.userDetails.shipping_details?.last_name || ""
      );
      setValue(
        "inputContactNumber",
        props.userDetails.shipping_details?.contact_number || ""
      );
      setValue(
        "inputAddress",
        props.userDetails.shipping_details?.address || ""
      );
      setValue("inputCity", props.userDetails.shipping_details?.city || "");
      setValue(
        "inputProvince",
        props.userDetails.shipping_details?.province || ""
      );

      setImage(props.userDetails.image);
    } else {
      fetchUser();
    }
    fetchOrder();
  }, [id, props]);

  return (
    <>
      <form onSubmit={handleSubmit(handleForm)}>
        <div className="container mx-auto py-20 p-10 h-full w-full">
          <div className="grid grid-cols-2 gap-4 m-2 h-full">
            <div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-12 w-full mt-6">
                <div className="">
                  <div className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                    User Image
                  </div>

                  <div className="flex flex-col w-auto h-auto p-10 text-gray-800 lg:bg-gray-50 ">
                    <div className="grid  grid-cols-2 gap-x-6 gap-y-12 w-full mt-6">
                      {image ? (
                        <div className="h-64 w-64 border-2 items-center rounded-md  bg-gray-300 border-gray-400 border-dotted">
                          <div className="flex cursor-pointer bg-white  w-auto justify-center">
                            <button
                              onClick={() => {
                                removeIndividualImage();
                              }}
                              className="flex rounded-full bg-white text-black "
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-x-circle m-auto"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                              </svg>
                              <span className="px-2">Remove</span>
                            </button>
                          </div>

                          <Image
                            className="m-auto object-cover"
                            src={
                              image.name ? URL.createObjectURL(image) : image
                            }
                            alt={
                              image.name ? URL.createObjectURL(image) : image
                            }
                            width="1024"
                            height="1024"
                          />
                        </div>
                      ) : (
                        <div className="h-64 w-64 border-2 items-center rounded-md  bg-gray-300 border-gray-400 border-dotted ">
                          <input
                            type="file"
                            onChange={(event) => handleIndividualFile(event)}
                            className="h-64 w-64 bg-green-200 opacity-0 z-10 absolute cursor-pointer"
                            name="files[]"
                          />
                          <div className="flex justify-center items-center ">
                            <div className="h-full w-full flex flex-col text-center m-auto">
                              <span className="text-[12px] mb-2">{`Upload an image`}</span>

                              <Image
                                className="m-auto object-cover "
                                src={no_image}
                                alt="no_image"
                                width="1024"
                                height="1024"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className="
                hidden lg:block"
                >
                  <div className="flex flex-wrap -mx-3 ">
                    {/* First Name */}
                    <div className="w-full px-3 mb-6">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-first-name"
                      >
                        First Name
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="grid-first-name"
                        type="text"
                        placeholder={userInfo.shipping_details?.first_name}
                        {...register("inputFirstName", {
                          onChange: (e: any) => setFirstName(e.target.value),
                        })}
                        aria-invalid={errors.inputFirstName ? "true" : "false"}
                      />
                    </div>
                    {errors.inputFirstName && (
                      <WarningMessage text={errors.inputFirstName?.message} />
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="flex space-x-0">
                    <div className="w-full  mb-6">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-last-name"
                      >
                        Last Name
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="grid-last-name"
                        type="text"
                        placeholder={userInfo.shipping_details?.last_name}
                        {...register("inputLastName", {
                          onChange: (e: any) => setLastName(e.target.value),
                        })}
                        aria-invalid={errors.inputLastName ? "true" : "false"}
                      />
                    </div>
                    {errors.inputLastName && (
                      <WarningMessage text={errors.inputLastName?.message} />
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-wrap -mx-3 ">
                    <div className="w-full px-3 mb-6">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-email"
                      >
                        Email
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        id="grid-email"
                        type="text"
                        placeholder={userInfo.email}
                        disabled
                      />
                    </div>
                  </div>
                  {/* Reset Password Button */}
                  <div className="flex flex-wrap -mx-3 ">
                    <div className="w-full px-3 mb-6">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-category"
                      >
                        Password
                      </label>
                      <button
                        className="appearance-none block w-full bg-nf_green text-white border  rounded py-3 px-4 mb-3 leading-tight hover:bg-nf_dark_blue"
                        onClick={() => {
                          handleResetPassword();
                        }}
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* */}
              <div className="visible lg:hidden">
                <div className="flex flex-wrap -mx-3 ">
                  {/* First Name */}
                  <div className="w-full px-3 mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      First Name
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-first-name"
                      type="text"
                      placeholder={userInfo.shipping_details?.first_name}
                      {...register("inputFirstName", {
                        onChange: (e: any) => setFirstName(e.target.value),
                      })}
                      aria-invalid={errors.inputFirstName ? "true" : "false"}
                    />
                  </div>
                  {errors.inputFirstName && (
                    <WarningMessage text={errors.inputFirstName?.message} />
                  )}
                </div>

                {/* Last Name */}
                <div className="flex space-x-0">
                  <div className="w-full  mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Last Name
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-last-name"
                      type="text"
                      placeholder={userInfo.shipping_details?.last_name}
                      {...register("inputLastName", {
                        onChange: (e: any) => setLastName(e.target.value),
                      })}
                      aria-invalid={errors.inputLastName ? "true" : "false"}
                    />
                  </div>
                  {errors.inputLastName && (
                    <WarningMessage text={errors.inputLastName?.message} />
                  )}
                </div>

                {/* Email Field */}
                <div className="flex flex-wrap -mx-3 ">
                  <div className="w-full px-3 mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-email"
                    >
                      Email
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-email"
                      type="text"
                      placeholder={userInfo.email}
                      disabled
                    />
                  </div>
                </div>
                {/* Reset Password Button */}
                <div className="flex flex-wrap -mx-3 ">
                  <div className="w-full px-3 mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-category"
                    >
                      Password
                    </label>
                    <button
                      className="appearance-none block w-full bg-nf_green text-white border  rounded py-3 px-4 mb-3 leading-tight hover:bg-nf_dark_blue"
                      onClick={() => {
                        handleResetPassword();
                      }}
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
              {/* Contact Number Field */}
              <div className="flex flex-wrap -mx-3 ">
                <div className="w-full px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-contact-number"
                  >
                    Contact Number
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-contact-number"
                    type="text"
                    placeholder={userInfo.shipping_details?.contact_number}
                    {...register("inputContactNumber", {
                      onChange: (e: any) => setContactNumber(e.target.value),
                    })}
                    aria-invalid={errors.inputContactNumber ? "true" : "false"}
                  />
                </div>
                {errors.inputContactNumber && (
                  <WarningMessage text={errors.inputContactNumber?.message} />
                )}
              </div>
              {/* Address Field */}
              <div className="flex flex-wrap -mx-3 ">
                <div className="w-full px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-address"
                  >
                    Address
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-address"
                    type="text"
                    placeholder={userInfo.shipping_details?.address}
                    {...register("inputAddress", {
                      onChange: (e: any) => setAddress(e.target.value),
                    })}
                    aria-invalid={errors.inputAddress ? "true" : "false"}
                  />
                </div>
                {errors.inputAddress && (
                  <WarningMessage text={errors.inputAddress?.message} />
                )}
              </div>
              {/* City Field */}
              <div className="flex flex-wrap -mx-3">
                <div className="w-full px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-city"
                  >
                    City
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-city"
                    type="text"
                    placeholder={userInfo.shipping_details?.city}
                    {...register("inputCity", {
                      onChange: (e: any) => setCity(e.target.value),
                    })}
                    aria-invalid={errors.inputCity ? "true" : "false"}
                  />
                </div>
                {errors.inputCity && (
                  <WarningMessage text={errors.inputCity?.message} />
                )}
              </div>
              {/* Province Field */}
              <div className="flex flex-wrap -mx-3 ">
                <div className="w-full px-3 mb-6">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    htmlFor="grid-province"
                  >
                    Province
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-province"
                    type="text"
                    placeholder={userInfo.shipping_details?.province}
                    {...register("inputProvince", {
                      onChange: (e: any) => setProvince(e.target.value),
                    })}
                    aria-invalid={errors.inputProvince ? "true" : "false"}
                  />
                </div>
                {errors.inputProvince && (
                  <WarningMessage text={errors.inputProvince?.message} />
                )}
              </div>

              <div>
                <input
                  type="button"
                  value="Discard Changes"
                  className=" w-1/2 cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
                  onClick={(e) => discardChanges(e)}
                />
                <input
                  type="submit"
                  value="Edit User"
                  className=" w-1/2 cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
                />
              </div>
            </div>
            <div>
              {orders && orders.length > 0 ? (
                <div className="mt-10">
                  <div className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-2">
                    Orders Summary
                  </div>
                  <div className="p-2 ml-4">
                    <TableComponent
                      headers={orderHeaders}
                      contentKeys={orderKeys}
                      content={orders}
                      type={"order"}
                      isAdmin={false}
                    ></TableComponent>
                  </div>
                </div>
              ) : null}

              {wellnessSurveyResult && wellnessSurveyResult.length > 0 ? (
                <div className="mt-10">
                  <div className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mt-2">
                    Survey Results Summary
                  </div>
                  <div className="p-2 ml-4">
                    <TableComponent
                      headers={wellnessSurveyResultHeaders}
                      contentKeys={wellnessSurveyResultKeys}
                      content={wellnessSurveyResult}
                      type={"wellness"}
                      isAdmin={false}
                    ></TableComponent>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const cookies = nookies.get(context);

    if (cookies.token) {
      const token = await admin.auth().verifyIdToken(cookies.token);

      const { uid } = token;

      const userDetails = await getUserFunction(uid);
      //should return if user is admin
      if (userDetails.isSuccess) {
        const isAdmin = userDetails.result.role == "admin" ? true : false;
        return {
          props: {
            user: uid,
            authorized: isAdmin,
            userDetails: userDetails.result,
            isError: false,
            errorMessage: "",
            redirect: "/",
          },
        };
      } else {
        return {
          props: {
            user: uid,
            authorized: false,
            userDetails: null,
            isError: false,
            errorMessage: "",
            redirect: "/",
          },
        };
      }
    } else {
      return {
        props: {
          user: null,
          authorized: false,
          userDetails: null,
          isError: false,
          errorMessage: "",
          redirect: "/",
        },
      };
    }
  } catch (err) {
    return {
      props: {
        user: null,
        userDetails: null,
        isError: true,
        errorMessage: "Error with getting user info",
        redirect: "/login",
      },
    };
  }
}
