import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import nookies from "nookies";
import { useForm } from "react-hook-form";

import admin from "../../../firebase/admin-config";
import { useAuthContext, AuthContext } from "@/context/AuthContext";

import no_image from "../../../public/no_image.png";

import {
  ProductCategoriesList,
  ProductsDatabaseType,
  ProductsDatabaseTypeFromDB,
} from "@/firebase/constants/product_constants";
import { CollectionsEnum } from "@/firebase/constants/enum_constants";
import {
  updateProductFunction,
  addProductFunction,
} from "@/firebase/firebase_functions/products_functions";
import { getDocumentGivenTypeAndIdFunction } from "@/firebase/firebase_functions/general_functions";
import { isUserAuthorizedFunction } from "@/firebase/firebase_functions/users_functions";

import WarningMessage from "@/components/forms/WarningMessage";

import HeadingTwo from "@/components/forms/HeadingTwo";
import InputComponent from "@/components/forms/input/InputComponent";
import Label from "@/components/forms/Label";
import InputSubmit from "@/components/forms/input/InputSubmit";
import { ErrorCodes } from "@/firebase/constants/success_and_error_codes";

export default function AdminAddProduct(props: any) {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [productDescription, setProductDescription] = useState("");
  const [files, setFiles] = useState<any>([]);
  const [message, setMessage] = useState("");
  const productImagesArray = [0, 1, 2, 3];

  const router = useRouter();
  const { error } = useAuthContext();
  const authContextObject = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      inputCategory: "",
      inputProductDescription: "",
      inputPrice: 0,
      inputQuantity: 0,
      inputProductName: "",
    },
  });

  const handleForm = async (data: any, e: any) => {
    e.preventDefault();
    const {
      inputCategory,
      inputProductDescription,
      inputPrice,
      inputQuantity,
      inputProductName,
    } = data;

    const productObject: ProductsDatabaseType = {
      category: inputCategory,
      description: inputProductDescription,
      price: parseInt(inputPrice),
      quantity_left: parseInt(inputQuantity),
      name: inputProductName,
      images: files,
    };
    const result = await addProductFunction(productObject);

    if (result.isSuccess) {
      authContextObject.success(result.message);
      router.push("/product");
    } else {
      authContextObject.error(result.message);
    }
  };

  const handleIndividualFile = (e: any, index: any) => {
    setMessage("");
    let file = e.target.files;
    let previousFiles = [...files];

    if (file[0].name) {
      const fileType = file[0]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        previousFiles[index] = file[0];
      } else {
        authContextObject.error(ErrorCodes["invalid-format"]);
      }
    } else {
      previousFiles[index] = file[0];
    }
    setFiles(previousFiles);
  };

  const removeIndividualImage = (i: any) => {
    let previousFiles = [...files];
    previousFiles[i] = "";
    setFiles(previousFiles);
  };

  if (props.isError) {
    error(props.message);
    router.push(props.redirect);
    return null;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleForm)}
        className="container mx-auto py-20 p-10 h-full w-full"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <HeadingTwo label={"Product Details"} id="productImage" />
            <div className="-mx-3 mb-6">
              <InputComponent
                id={"productName"}
                name={"inputProductName"}
                label={"Product Name"}
                type={"text"}
                placeholder={"Type your product name..."}
                value={productName}
                register={register}
                rules={{
                  required: "Product name is required",
                  onChange: (e: any) => setProductName(e.target.value),
                }}
                error={errors}
                aria-invalid={errors.inputProductName ? "true" : "false"}
              />
              {/* <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-product-name"
                >
                  Product Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                  id="grid-product-name"
                  type="text"
                  placeholder="Type your name..."
                  {...register("inputProductName", {
                    required: "Product name is required",
                    onChange: (e: any) => setProductName(e.target.value),
                  })}
                  aria-invalid={errors.inputProductName ? "true" : "false"}
                />
              </div>
              {errors.inputProductName && (
                <WarningMessage text={errors.inputProductName?.message} />
              )} */}
            </div>
            <div className="-mx-3 mb-6">
              <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-category"
                >
                  Categories
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-category"
                    {...register("inputCategory", {
                      required: "Category is required",
                      onChange: (e: any) => setCategory(e.target.value),
                    })}
                    aria-invalid={errors.inputCategory ? "true" : "false"}
                  >
                    {ProductCategoriesList.map((category) => {
                      return (
                        <option value={category} key={category}>
                          {category}
                        </option>
                      );
                    })}
                  </select>
                  {errors.inputCategory && (
                    <WarningMessage text={errors.inputCategory?.message} />
                  )}
                </div>
              </div>
            </div>
            <div className="-mx-3 mb-6">
              <InputComponent
                id={"price"}
                name={"inputPrice"}
                label={"Price"}
                type={"number"}
                placeholder={"Type your price..."}
                value={price}
                register={register}
                rules={{
                  required: "Price is required",
                  onChange: (e: any) => setPrice(parseInt(e.target.value)),
                }}
                error={errors}
                aria-invalid={errors.inputPrice ? "true" : "false"}
              />
              {/* <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-price"
                >
                  Price
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-price"
                  type="number"
                  placeholder="Type your price..."
                  {...register("inputPrice", {
                    required: "Price is required",
                    onChange: (e: any) => setPrice(parseInt(e.target.value)),
                  })}
                  aria-invalid={errors.inputPrice ? "true" : "false"}
                />
              </div>
              {errors.inputPrice && (
                <WarningMessage text={errors.inputPrice?.message} />
              )} */}
            </div>
            <div className="-mx-3 mb-6">
              <InputComponent
                id={"quantity"}
                name={"inputQuantity"}
                label={"Quantity"}
                type={"number"}
                placeholder={"Type the quantity..."}
                value={quantity}
                register={register}
                rules={{
                  required: "Quantity is required",
                  onChange: (e: any) => setQuantity(parseInt(e.target.value)),
                }}
                error={errors}
                aria-invalid={errors.inputQuantity ? "true" : "false"}
              />
              {/* <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-quantity"
                >
                  Quantity
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-quantity"
                  type="number"
                  placeholder="Type your quantity..."
                  {...register("inputQuantity", {
                    required: "Quantity is required",
                    onChange: (e: any) => setQuantity(parseInt(e.target.value)),
                  })}
                  aria-invalid={errors.inputQuantity ? "true" : "false"}
                />
              </div>
              {errors.inputQuantity && (
                <WarningMessage text={errors.inputQuantity?.message} />
              )} */}
            </div>
            <div className="-mx-3 mb-6">
              <div className="w-full px-3 mb-6">
                <Label label={"Product Description"} id="productDescription" />
                {/* <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-product-description"
                >
                  Product Description
                </label> */}
                <textarea
                  className="block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white h-full"
                  id="grid-product-description"
                  rows={3}
                  placeholder="Type your product description..."
                  {...register("inputProductDescription", {
                    required: "Product description is required",
                    onChange: (e: any) => setProductDescription(e.target.value),
                  })}
                  aria-invalid={
                    errors.inputProductDescription ? "true" : "false"
                  }
                />

                {errors.inputProductDescription && (
                  <WarningMessage
                    text={errors.inputProductDescription?.message}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="h-full">
              <HeadingTwo label={"Product Images"} id="productImage" />

              <div className="flex flex-col w-auto min-h-screen p-10 bg-gray-100 text-gray-800">
                <div className="grid  grid-cols-2 gap-x-6 gap-y-12 w-full mt-6">
                  {/* Product Tile Start */}
                  {files != undefined
                    ? productImagesArray.map((e) => {
                        var fileImage: any = no_image;
                        files[e] === undefined
                          ? (fileImage = no_image)
                          : files[e].name != undefined
                          ? (fileImage = URL.createObjectURL(files[e]))
                          : (fileImage = files[e]);
                        return (
                          <>
                            <div
                              key={e}
                              className="overflow-hidden relative bg-gray-500"
                            >
                              {files[e] === undefined || files[e] === "" ? (
                                <div className="h-96 w-96  border-2 items-center rounded-md  bg-gray-300 border-gray-400 border-dotted ">
                                  <input
                                    type="file"
                                    onChange={(event) =>
                                      handleIndividualFile(event, e)
                                    }
                                    className="w-full h-full bg-green-200 opacity-0 z-10 absolute cursor-pointer"
                                    name="files[]"
                                  />
                                  <div className="h-full w-full bg-gray-200 absolute z-1 flex justify-center items-center top-0 ">
                                    <div className="flex flex-col text-center m-auto mt-2">
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
                                  <p>where the fuck</p>
                                </div>
                              ) : (
                                <div className="justify-center items-center">
                                  <div className="flex cursor-pointer   bg-white  w-auto justify-center">
                                    <button
                                      onClick={() => {
                                        removeIndividualImage(e);
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

                                  {/* TODO:doesnt show image when it showsin catalog */}
                                  <Image
                                    className="m-auto object-cover"
                                    src={fileImage}
                                    alt={fileImage}
                                    width="1024"
                                    height="1024"
                                  />
                                  {/* <p>{fileImage}</p> */}
                                </div>
                              )}
                            </div>
                          </>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
            <div>
              <InputSubmit label={"Add Product"} />
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
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    const isAdmin = await isUserAuthorizedFunction(uid);

    if (!isAdmin) {
      // context.res.writeHead(302, { Location: "/login" });
      // context.res.end();

      return {
        props: {
          isError: true,
          message: "Unauthorized access",
          redirect: "/",
        },
      };
    }

    return {
      props: {
        authorized: isAdmin,
        isError: false,
        message: "",
        redirect: "",
      },
    };
  } catch (err) {
    return {
      props: {
        isError: true,
        message: "Unauthorized access",
        redirect: "/login",
      },
    };
  }
}
