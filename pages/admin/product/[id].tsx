import { useRouter } from "next/router";
import React, { useEffect, useState, useContext } from "react";
import { useAuthContext, AuthContext } from "@/context/AuthContext";
import {
  PRODUCT_CATEGORIES_ARRAY,
  PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY,
  ProductsDatabaseType,
} from "../../../firebase/constants";
import {
  addProductFunction,
  getProductViaIdFunction,
  updateProductFunction,
} from "@/firebase/firebase_functions/products_functions";
import Image from "next/image";
import no_image from "../../../public/no_image.png";
import { getUserFunction } from "@/firebase/firebase_functions/users_functions";
import nookies from "nookies";
import admin from "../../../firebase/admin-config";

import { useForm } from "react-hook-form";
import WarningMessage from "@/components/forms/WarningMessage";

import HeadingTwo from "@/components/forms/HeadingTwo";
import InputButton from "@/components/forms/input/InputButton";
import InputComponent from "@/components/forms/input/InputComponent";
import InputSubmit from "@/components/forms/input/InputSubmit";
import Label from "@/components/forms/Label";

export default function AdminProductShow(props: any) {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<ProductsDatabaseType>({
    id: "",
    name: "",
    category: "",
    created_at: "",
    description: "",
    price: 0,
    quantity_left: 0,
    quantity_in_carts: 0,
    quantity_sold: 0,
    updated_at: "",
    images: [],
  });
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [quantityLeft, setQuantityLeft] = useState(0);
  const [quantityInCarts, setQuantityInCarts] = useState(0);
  const [quantitySold, setQuantitySold] = useState(0);
  const [productDescription, setProductDescription] = useState("");
  const [files, setFiles] = useState<any>([]);
  const [message, setMessage] = useState("");
  const productImagesArray = [0, 1, 2, 3];
  const { error } = useAuthContext();
  const authContextObject = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      inputCategory: "",
      inputProductDescription: "",
      inputPrice: "",
      inputQuantity: "",
      inputProductName: "",
    },
  });

  async function fetchProduct() {
    var idInput = "";
    if (id) {
      if (id[0]) {
        idInput = id.toString();
      } else if (typeof id == "string") {
        idInput = id;
      }
    }
    const result = await getProductViaIdFunction(idInput);

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setProduct(result.result);

      setProductName(result.result.name);
      setProductDescription(result.result.description);
      setProductCategory(result.result.category);
      setPrice(result.result.price);
      setQuantityLeft(result.result.quantity_left);
      setQuantityInCarts(result.result.quantity_in_carts);
      setQuantitySold(result.result.quantity_sold);
      setFiles(result.result.images);

      setValue("inputCategory", result.result.category);
      setValue("inputProductDescription", result.result.description);
      setValue("inputPrice", result.result.price);
      setValue("inputQuantity", result.result.quantity_left);
      setValue("inputProductName", result.result.name);
    }
  }

  useEffect(() => {
    // router.replace("/maintenance");
    fetchProduct();
  }, []);

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
        authContextObject.error("Only images accepted");
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

  const handleForm = async (data: any, e: any) =>
    // event: any
    {
      e.preventDefault();
      const {
        inputCategory,
        inputProductDescription,
        inputPrice,
        inputQuantity,
        inputProductName,
      } = data;

      var idInput = "";
      if (id) {
        if (id[0]) {
          idInput = id.toString();
        } else if (typeof id == "string") {
          idInput = id;
        }
      }
      const productObject: ProductsDatabaseType = {
        category: inputCategory,
        description: inputProductDescription,
        price: inputPrice,
        quantity_left: inputQuantity,
        name: inputProductName,
        images: files,
        quantity_in_carts: quantityInCarts,
        quantity_sold: quantitySold,
        created_at: product.created_at,
      };
      const result = await updateProductFunction(productObject, idInput);

      if (result.isSuccess) {
        authContextObject.success(result.resultText);
        router.push("/admin/product");
      } else {
        authContextObject.error(result.errorMessage);
      }
    };

  if (props.isError) {
    error(props.errorMessage);
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
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-product-name"
                  type="text"
                  value={productName}
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
                      onChange: (e: any) => setProductCategory(e.target.value),
                    })}
                    aria-invalid={errors.inputCategory ? "true" : "false"}
                  >
                    {PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.map((category) => {
                      return (
                        <option
                          value={category}
                          key={category}
                          selected={productCategory == category ? true : false}
                        >
                          {category}
                        </option>
                      );
                    })}
                  </select>
                  {errors.inputCategory && (
                    <WarningMessage text={errors.inputCategory?.message} />
                  )}
                  {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div> */}
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
                  value={price}
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
                id={"quantityLeft"}
                name={"inputQuantity"}
                label={"Quantity Left"}
                type={"number"}
                placeholder={"Type the quantity left..."}
                value={quantityLeft}
                register={register}
                rules={{
                  required: "Quantity is required",
                  onChange: (e: any) =>
                    setQuantityLeft(parseInt(e.target.value)),
                }}
                error={errors}
                aria-invalid={errors.inputQuantity ? "true" : "false"}
              />
              {/* <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-quantity-left"
                >
                  Quantity Left
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-quantity-left"
                  type="number"
                  value={quantityLeft}
                  placeholder="Type your quantity..."
                  {...register("inputQuantity", {
                    required: "Quantity is required",
                    onChange: (e: any) =>
                      setQuantityLeft(parseInt(e.target.value)),
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
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-quantity-sold"
                >
                  Quantity Sold
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white "
                  id="grid-quantity-left"
                  type="number"
                  value={quantitySold}
                  placeholder="Type your quantity..."
                  onChange={(e) => setQuantitySold(parseInt(e.target.value))}
                  required
                  disabled
                />
              </div>
            </div>
            <div className="-mx-3 mb-6">
              <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-quantity-in-cart"
                >
                  Quantity In Cart
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white "
                  id="grid-quantity-in-cart"
                  type="number"
                  value={quantityInCarts}
                  placeholder="Type your quantity..."
                  onChange={(e) => setQuantityInCarts(parseInt(e.target.value))}
                  required
                  disabled
                />
              </div>
            </div>
            <div className="-mx-3 mb-6">
              <InputComponent
                id={"productDescription"}
                name={"inputProductDescription"}
                label={"Product Description"}
                type={"text"}
                placeholder={"Type the product description..."}
                value={productDescription}
                register={register}
                rules={{
                  required: "Product description is required",
                  onChange: (e: any) => setProductDescription(e.target.value),
                }}
                error={errors}
                aria-invalid={errors.inputProductDescription ? "true" : "false"}
              />
              {/* <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-product-description"
                >
                  Product Description
                </label>
                <textarea
                  className="block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white h-full"
                  id="grid-product-description"
                  rows={3}
                  placeholder="Type your product description..."
                  value={productDescription}
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
                )} */}
              {/* </div> */}
            </div>
          </div>
          <div>
            <div className="h-full">
              <HeadingTwo label="Product Images" id="productImage" />

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
                                <div className="h-96 w-96 border-2 items-center rounded-md  bg-gray-300 border-gray-400 border-dotted ">
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
              <input
                type="submit"
                value="Edit Product"
                className=" w-full cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
              />
            </div>
          </div>
        </div>

        {/* <div className="-mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Password
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="password"
              placeholder="******************"
            />
            <p className="text-gray-600 text-xs italic">
              Make it as long and as crazy as you'd like
            </p>
          </div>
        </div>
        <div className="-mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              City
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-city"
              type="text"
              placeholder="Albuquerque"
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              State
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
              >
                <option>New Mexico</option>
                <option>Missouri</option>
                <option>Texas</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-zip"
            >
              Zip
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-zip"
              type="text"
              placeholder="90210"
            />
          </div>
        </div> */}
      </form>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    console.log("server side auth be like");
    const cookies = nookies.get(context);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    const a = await getUserFunction(uid);
    const isAdmin = a.result.role == "admin" ? true : false;

    if (!isAdmin) {
      // context.res.writeHead(302, { Location: "/login" });
      // context.res.end();

      return {
        props: {
          isError: true,
          errorMessage: "Unauthorized access",
          redirect: "/",
        },
      };
    }

    return {
      props: {
        message: `Your email is ${email} and your UID is ${uid}.`,
        authorized: isAdmin,
        isError: false,
        errorMessage: "",
        redirect: "",
      },
    };
  } catch (err) {
    // context.res.writeHead(302, { Location: "/login" });
    // context.res.end();

    return {
      props: {
        isError: true,
        errorMessage: "Unauthenticated access",
        redirect: "/login",
      },
    };
  }
}
