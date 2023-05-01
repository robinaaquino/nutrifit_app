import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { getAllUsers } from "../firebase/services/users_services";
import React, { useEffect, useContext, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import no_image from "../public/no_image.png";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORIES_PUBLIC_NAME,
  PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY,
} from "@/firebase/constants";
import nookies from "nookies";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const authContextObject = useContext(AuthContext);
  const landingPageCategories = [
    PRODUCT_CATEGORIES.OUTER_NUTRITION_VITAMIN_MASK,
    PRODUCT_CATEGORIES.INNER_NUTRITION_WEIGHT_MANAGEMENT_CORE_PRODUCTS,
    PRODUCT_CATEGORIES.PRODUCT_PACKS,
    PRODUCT_CATEGORIES.SHAKES,
  ];
  const [categoryIndex, setCategoryIndex] = useState(0);
  const numberOfShownCategories = 3;

  function returnCategoryName(index: number) {
    if (index >= PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.length) {
      return PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY[
        index - PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.length
      ];
    } else if (index < 0) {
      return PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY[
        PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.length - index
      ];
    } else {
      return PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY[index];
    }
  }

  function decrementCategoryIndex() {
    if (categoryIndex <= 0) {
      let newCategoryIndex = PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.length;
      setCategoryIndex(newCategoryIndex);
    } else {
      let newCategoryIndex = categoryIndex - 1;
      setCategoryIndex(newCategoryIndex);
    }
  }

  function incrementCategoryIndex() {
    if (categoryIndex > PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.length) {
      let newCategoryIndex = 0;
      setCategoryIndex(newCategoryIndex);
    } else {
      let newCategoryIndex = categoryIndex + 1;
      setCategoryIndex(newCategoryIndex);
    }
  }

  useEffect(() => {
    if (process.env.TEST_KEY === `uwu`) {
    }
  }, []);

  return (
    <>
      {/* <main></main> */}
      <div className="bg-nf_green bg-opacity-70">
        <div className="container mx-auto px-6 text-center py-20">
          <h2 className="mb-6 text-4xl font-bold text-center text-white">
            Personalized meal plans?
          </h2>
          <h3 className="my-4 text-2xl text-white">
            More likely than you think!
          </h3>
          <button className="bg-white font-bold rounded-full mt-6 py-4 px-8 uppercase tracking-wider text-black">
            Get started with filling up your meal plan
          </button>
        </div>
      </div>
      <div>
        <div className="bg-white">
          {/* <div className="container mx-auto px-6 text-center py-20 "> */}
          <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8  w-full">
            <h2 className="mb-6 text-4xl font-bold text-center text-black">
              Best selling products
            </h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 ">
              {landingPageCategories.map((e: string) => {
                const currentCategory = PRODUCT_CATEGORIES_PUBLIC_NAME[e];
                return (
                  <>
                    <a href="#" className="group">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                        <Image
                          className="h-full w-full object-cover object-center group-hover:opacity-75 "
                          src={no_image}
                          alt="Sunset in the mountains"
                          width="256"
                          height="256"
                        />
                        {/* <img
                    src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
                    alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  /> */}
                      </div>
                      <h3 className="mt-4 text-lg text-gray-700 text-center">
                        {currentCategory}
                      </h3>
                      {/* <p className="mt-1 text-lg font-medium text-gray-900">$48</p> */}
                    </a>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-nf_green bg-opacity-50">
          {/* <div className="container mx-auto px-6 text-center py-20 "> */}
          <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8  w-full">
            <h2 className="mb-6 text-4xl font-bold text-center text-black">
              Product Categories
            </h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 ">
              <div className="carousel w-full ">
                <div
                  id={`slide${categoryIndex}`}
                  className="carousel-item relative w-full justify-center items-center gap-4"
                >
                  <button
                    className="btn btn-circle"
                    onClick={() => decrementCategoryIndex()}
                  >
                    ❮
                  </button>
                  <button
                    onClick={() => {
                      nookies.set(
                        undefined,
                        "category",
                        returnCategoryName(categoryIndex),
                        {
                          path: "/",
                        }
                      );
                      router.push("/product");
                    }}
                    className="group"
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                      <Image
                        className="h-full w-full object-cover object-center group-hover:opacity-75 "
                        src={no_image}
                        alt="Sunset in the mountains"
                        width="256"
                        height="256"
                      />
                    </div>
                    <h3 className="mt-4 text-lg text-gray-700 text-center">
                      {returnCategoryName(categoryIndex)}
                    </h3>
                  </button>
                  <button
                    onClick={() => {
                      nookies.set(
                        undefined,
                        "category",
                        returnCategoryName(categoryIndex + 1),
                        {
                          path: "/",
                        }
                      );
                      router.push("/product");
                    }}
                    className="group"
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                      <Image
                        className="h-full w-full object-cover object-center group-hover:opacity-75 "
                        src={no_image}
                        alt="Sunset in the mountains"
                        width="256"
                        height="256"
                      />
                    </div>
                    <h3 className="mt-4 text-lg text-gray-700 text-center">
                      {returnCategoryName(categoryIndex + 1)}
                    </h3>
                  </button>
                  <button
                    onClick={() => {
                      nookies.set(
                        undefined,
                        "category",
                        returnCategoryName(categoryIndex + 2),
                        {
                          path: "/",
                        }
                      );
                      router.push("/product");
                    }}
                    className="group"
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                      <Image
                        className="h-full w-full object-cover object-center group-hover:opacity-75 "
                        src={no_image}
                        alt="Sunset in the mountains"
                        width="256"
                        height="256"
                      />
                    </div>
                    <h3 className="mt-4 text-lg text-gray-700 text-center">
                      {returnCategoryName(categoryIndex + 2)}
                    </h3>
                  </button>
                  <button
                    onClick={() => incrementCategoryIndex()}
                    className="btn btn-circle"
                  >
                    ❯
                  </button>
                </div>
              </div>
              {/* {landingPageCategories.map((e: string) => {
                const currentCategory = PRODUCT_CATEGORIES_PUBLIC_NAME[e];
                return (
                  <>
                    <a href="#" className="group">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                        <Image
                          className="h-full w-full object-cover object-center group-hover:opacity-75 "
                          src={no_image}
                          alt="Sunset in the mountains"
                          width="256"
                          height="256"
                        />
                      </div>
                      <h3 className="mt-4 text-lg text-gray-700 text-center">
                        {currentCategory}
                      </h3>
                    </a>
                  </>
                );
              })} */}
            </div>
          </div>
          {/* <div className="carousel w-full">
            <div
              id={`slide${categoryIndex}`}
              className="carousel-item relative w-full"
            >
              <a href="#" className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                  <Image
                    className="h-full w-full object-cover object-center group-hover:opacity-75 "
                    src={no_image}
                    alt="Sunset in the mountains"
                    width="256"
                    height="256"
                  />
                </div>
                <h3 className="mt-4 text-lg text-gray-700 text-center">
                  {returnCategoryName(categoryIndex)}
                </h3>
              </a>
              <a href="#" className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                  <Image
                    className="h-full w-full object-cover object-center group-hover:opacity-75 "
                    src={no_image}
                    alt="Sunset in the mountains"
                    width="256"
                    height="256"
                  />
                </div>
                <h3 className="mt-4 text-lg text-gray-700 text-center">
                  {returnCategoryName(categoryIndex + 1)}
                </h3>
              </a>
              <a href="#" className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                  <Image
                    className="h-full w-full object-cover object-center group-hover:opacity-75 "
                    src={no_image}
                    alt="Sunset in the mountains"
                    width="256"
                    height="256"
                  />
                </div>
                <h3 className="mt-4 text-lg text-gray-700 text-center">
                  {returnCategoryName(categoryIndex + 2)}
                </h3>
              </a>
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <button
                  className="btn btn-circle"
                  onClick={() => decrementCategoryIndex()}
                >
                  ❮
                </button>
                <button
                  onClick={() => incrementCategoryIndex()}
                  className="btn btn-circle"
                >
                  ❯
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
