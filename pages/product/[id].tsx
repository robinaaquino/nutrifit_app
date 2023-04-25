import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  PRODUCT_CATEGORIES_ARRAY,
  PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY,
  ProductsDatabaseType,
} from "../../firebase/constants";
import {
  addProductFunction,
  getProductViaIdFunction,
  updateProductFunction,
} from "@/firebase/firebase_functions/products_function";
import { useAuthContext } from "@/context/AuthContext";
import no_image from "../../public/no_image.png";
import Image from "next/image";
import nookies from "nookies";
import admin from "../../firebase/admin-config";

export default function ProductShow(props: any) {
  const router = useRouter();
  const productImagesArray = [0, 1, 2, 3];
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
  const { id } = router.query;
  const { error, user, addToCart } = useAuthContext();
  const [displayImage, setDisplayImage] = useState<any>(no_image);
  const [availableImagesCount, setAvailableImagesCount] = useState(0);
  const [allImages, setAllImages] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);

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
    // console.log("result: ", result);

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setProduct(result.result);
      let hasImage = false;
      let count = 0;
      let productImages = result.result.images;
      let validImages = [];
      for (let i = 0; i < productImages.length; i++) {
        if (productImages[i] != undefined || productImages[i] != "") {
          hasImage = true;
          count++;
          validImages.push(productImages[i]);
          setDisplayImage(productImages[i]);
        }
      }

      setAllImages(validImages);
      setAvailableImagesCount(count);

      if (!hasImage) {
        setDisplayImage(no_image);
      }
    }
  }

  async function handleAddToCart(product: any, quantity: any) {
    if (props.user) {
      await addToCart(product, quantity, user);
    } else {
      await addToCart(product, quantity);
    }
  }

  const updateDisplayImage = (index: any) => {
    setDisplayImage(product.images[index]);
  };

  useEffect(() => {
    // router.replace("/maintenance");
    fetchProduct();
  }, []);
  return (
    <>
      <div>
        <section className="py-10 font-poppins">
          <div className="max-w-6xl px-4 mx-auto">
            <div className="flex flex-wrap mb-24 -mx-4">
              {availableImagesCount > 0 ? (
                <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
                  <div className="sticky top-0 overflow-hidden ">
                    <div className="relative mb-6 lg:mb-10 lg:h-96">
                      <a
                        className="absolute left-0 transform lg:ml-2 top-1/2 translate-1/2"
                        href="#"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="w-5 h-5 text-blue-500 bi bi-chevron-left dark:text-blue-200"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                          ></path>
                        </svg>
                      </a>
                      <Image
                        className="object-contain w-full lg:h-full bg-white"
                        src={displayImage}
                        alt=""
                        width="1024"
                        height="1024"
                      />
                      <a
                        className="absolute right-0 transform lg:mr-2 top-1/2 translate-1/2"
                        href="#"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="w-5 h-5 text-blue-500 bi bi-chevron-right dark:text-blue-200"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                          ></path>
                        </svg>
                      </a>
                    </div>
                    <div className="flex-wrap hidden -mx-2 md:flex">
                      {availableImagesCount >= 4
                        ? allImages.map((e) => {
                            return (
                              <>
                                <div className="w-1/2 p-2 sm:w-1/4">
                                  <button
                                    className="block border border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-300"
                                    onClick={() => setDisplayImage(e)}
                                  >
                                    <Image
                                      className="object-contain w-full lg:h-28"
                                      src={e}
                                      alt={e}
                                      width="1024"
                                      height="1024"
                                    />
                                  </button>
                                </div>
                              </>
                            );
                          })
                        : availableImagesCount == 3
                        ? allImages.map((e) => {
                            return (
                              <>
                                <div className="w-1/3 p-2 sm:w-1/4">
                                  <button
                                    className="block border border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-300"
                                    onClick={() => setDisplayImage(e)}
                                  >
                                    <Image
                                      className="object-contain w-full lg:h-28"
                                      src={e}
                                      alt={e}
                                      width="1024"
                                      height="1024"
                                    />
                                  </button>
                                </div>
                              </>
                            );
                          })
                        : availableImagesCount == 2
                        ? allImages.map((e) => {
                            return (
                              <>
                                <div className="w-1/2 p-2 sm:w-1/4">
                                  <button
                                    className="block border border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-300"
                                    onClick={() => setDisplayImage(e)}
                                  >
                                    <Image
                                      className="object-contain w-full lg:h-28"
                                      src={e}
                                      alt={e}
                                      width="1024"
                                      height="1024"
                                    />
                                  </button>
                                </div>
                              </>
                            );
                          })
                        : availableImagesCount == 1
                        ? allImages.map((e) => {
                            return (
                              <>
                                <div className="w-full p-2 sm:w-1/4">
                                  <button
                                    className="block border border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-300"
                                    onClick={() => setDisplayImage(e)}
                                  >
                                    <Image
                                      className="object-contain w-full lg:h-28"
                                      src={e}
                                      alt={e}
                                      width="1024"
                                      height="1024"
                                    />
                                  </button>
                                </div>
                              </>
                            );
                          })
                        : null}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="w-full px-4 md:w-1/2">
                <div className="lg:pl-20">
                  <div className="mb-6 ">
                    <span className="px-2.5 py-0.5 text-xs text-gray-200 bg-gray-700 rounded-xl ">
                      {product.category}
                    </span>
                    <h2 className="max-w-xl mt-6 mb-6 text-2xl font-semibold leading-loose tracking-wide text-black ">
                      {product.name}
                    </h2>
                    {/* <div className="flex flex-wrap items-center mb-6">
                      <ul className="flex mb-4 mr-2 lg:mb-0">
                        <li>
                          <a href="#">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                            </svg>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"></path>
                            </svg>
                          </a>
                        </li>
                      </ul>
                      <span className="mb-4 text-xs hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300 lg:mb-0">
                        {product.category}
                      </span>
                    </div> */}
                    <p className="inline-block text-2xl font-semibold text-black  ">
                      <span>Php {product.price}</span>
                      {/* <span className="ml-3 text-base font-normal text-gray-500 line-through dark:text-gray-400">
                        Rs.10,000.00
                      </span> */}
                    </p>
                  </div>
                  <div className="mb-6">
                    <h2 className="mb-2 text-lg font-bold text-gray-700 ">
                      {product.description}
                    </h2>
                    {/* <div className="bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div className="p-3 lg:p-5 ">
                        <div className="p-2 rounded-xl lg:p-6 dark:bg-gray-800 bg-gray-50">
                          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                            <div className="w-full mb-4 md:w-2/5">
                              <div className="flex ">
                                <span className="mr-3 text-gray-500 dark:text-gray-400">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-diagram-3 w-7 h-7"
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5v-1zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1zM0 11.5A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"
                                    ></path>
                                  </svg>
                                </span>
                                <div>
                                  <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    No. of cores
                                  </p>
                                  <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400">
                                    12 Cores
                                  </h2>
                                </div>
                              </div>
                            </div>
                            <div className="w-full mb-4 md:w-2/5">
                              <div className="flex ">
                                <span className="mr-3 text-gray-500 dark:text-gray-400">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-gpu-card w-7 h-7"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm7.5-1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"></path>
                                    <path d="M0 1.5A.5.5 0 0 1 .5 1h1a.5.5 0 0 1 .5.5V4h13.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H2v2.5a.5.5 0 0 1-1 0V2H.5a.5.5 0 0 1-.5-.5Zm5.5 4a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM9 8a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"></path>
                                    <path d="M3 12.5h3.5v1a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5v-1Zm4 1v-1h4v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5Z"></path>
                                  </svg>
                                </span>
                                <div>
                                  <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Graphic
                                  </p>
                                  <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400">
                                    Intel UHD
                                  </h2>
                                </div>
                              </div>
                            </div>
                            <div className="w-full mb-4 lg:mb-0 md:w-2/5">
                              <div className="flex ">
                                <span className="mr-3 text-gray-500 dark:text-gray-400">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="w-7 h-7 bi bi-cpu"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"></path>
                                  </svg>
                                </span>
                                <div>
                                  <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Processor
                                  </p>
                                  <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400">
                                    INTEL 80486
                                  </h2>
                                </div>
                              </div>
                            </div>
                            <div className="w-full mb-4 lg:mb-0 md:w-2/5">
                              <div className="flex ">
                                <span className="mr-3 text-gray-500 dark:text-gray-400">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-clock-history w-7 h-7"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"></path>
                                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"></path>
                                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"></path>
                                  </svg>
                                </span>
                                <div>
                                  <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Frequency
                                  </p>
                                  <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400">
                                    3.5 GHz
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="py-6 mb-6 border-t border-b border-gray-200 dark:border-gray-700">
                    <span className="text-base text-black">
                      {product.quantity_left > 0 ? "In stock" : "Out of stock"}
                    </span>
                    {/* <p className="mt-2 text-sm text-blue-500 dark:text-blue-200">
                      Ships from china.
                      <span className="text-gray-600 dark:text-gray-400">
                        Most customers receive within 3-31 days.
                      </span>
                    </p> */}
                  </div>
                  <div className="mb-6 "></div>
                  <div className="flex flex-wrap items-center mb-6">
                    {/* TODO: MAKE + AND - FUNCTIONAL */}
                    <div className="mb-4 mr-4 lg:mb-0">
                      <div className="w-28">
                        <div className="relative flex flex-row w-full h-10 bg-transparent rounded-lg">
                          <button
                            className="w-20 h-full text-gray-600 bg-white border border-black border-r rounded-l outline-none cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                              if (
                                document.getElementById("quantityToBuy") !=
                                  null &&
                                document.getElementById("quantityToBuy")
                                  .value != null &&
                                document.getElementById("quantityToBuy").value >
                                  1
                              ) {
                                document.getElementById("quantityToBuy")
                                  .value--;
                              }
                            }}
                          >
                            <span className="m-auto text-2xl font-thin">-</span>
                          </button>
                          <input
                            id="quantityToBuy"
                            type="number"
                            className="flex items-center w-full font-semibold text-center text-gray-700 placeholder-gray-700 bg-white outline-none  text-md border border-black"
                            value={quantity}
                            onChange={(e) => {
                              setQuantity(parseInt(e.target.value));
                            }}
                          />
                          <button
                            className="w-20 h-full text-gray-600 bg-white border border-black border-l rounded-r outline-none cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                              if (
                                document.getElementById("quantityToBuy")
                                  .value <= product.quantity_left
                              ) {
                                document.getElementById("quantityToBuy")
                                  .value++;
                              }
                            }}
                          >
                            <span className="m-auto text-2xl font-thin">+</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* <div className="mb-4 lg:mb-0">
                      <button className="flex items-center justify-center w-full h-10 p-2 mr-4 text-gray-700 border border-gray-300 lg:w-11 hover:text-gray-50 dark:text-gray-200 dark:border-blue-600 hover:bg-blue-600 hover:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 dark:hover:border-blue-500 dark:hover:text-gray-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className=" bi bi-heart"
                          viewBox="0 0 16 16"
                        >
                          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path>
                        </svg>
                      </button>
                    </div> */}
                    <button
                      onClick={() => {
                        console.log(user);
                        console.log("omo");
                        handleAddToCart(product, quantity);
                      }}
                      className="w-1/2 px-4 py-3 text-center text-white bg-nf_green hover:bg-nf_dark_blue  rounded-xl"
                    >
                      Add to cart
                    </button>
                  </div>
                  {/* <div className="flex gap-4 mb-6">
                    <a
                      href="#"
                      className="w-full px-4 py-3 text-center text-gray-100 bg-blue-600 border border-transparent dark:border-gray-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-900 rounded-xl"
                    >
                      Buy now
                    </a>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const cookies = nookies.get(context);

    if (cookies.token) {
      const token = await admin.auth().verifyIdToken(cookies.token);

      const { uid } = token;

      return {
        props: {
          user: uid,
          isError: false,
          errorMessage: "",
          redirect: "/",
        },
      };
    } else {
      console.log("ah then here?");
      if (cookies.cart) {
        return {
          props: {
            cart: JSON.parse(cookies.cart),
            isError: false,
            errorMessage: "",
            redirect: "/",
          },
        };
      } else {
        console.log("here then");
        return {
          props: {
            cart: null,
            isError: false,
            errorMessage: "",
            redirect: "/",
          },
        };
      }
    }
  } catch (err) {
    return {
      props: {
        user: null,
        isError: true,
        errorMessage: "Error with getting user info",
        redirect: "/logn",
      },
    };
  }
}
