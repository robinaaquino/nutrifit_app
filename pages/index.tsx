import Head from "next/head";
import Image from "next/image";
import { getAllUsers } from "../firebase/services/users_services";
import React, { useEffect, useContext, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { AuthContext, useAuthContext } from "@/context/AuthContext";
import no_image from "../public/no_image.png";
import landing_page from "../public/landing_page.jpg";
import {
  PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY,
  ProductsDatabaseType,
} from "@/firebase/constants";
import nookies from "nookies";
import { getBestSellingProducts } from "@/firebase/firebase_functions/products_functions";

import admin from "../firebase/admin-config";

import Button from "@/components/common/Button";
import ProductCard from "@/components/product/ProductCard";

export default function Home(props: any) {
  const router = useRouter();
  // const authContextObject = useContext(AuthContext);
  const { user, success, error, addToCart } = useAuthContext();
  const landingPageCategories = [
    ...PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.slice(0, 4),
  ];
  const [categoryIndex, setCategoryIndex] = useState(0);
  const numberOfShownCategories = 3;
  const [bestProducts, setBestProducts] = useState<any>([]);

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

  function navigateToSurvey() {
    router.push("/wellness/add");
  }

  async function fetchBestProducts() {
    const result = await getBestSellingProducts();

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      let limit: number = result.result.length > 4 ? 4 : result.result.length;
      setBestProducts(result.result.slice(0, limit));
    }
  }

  async function handleAddToCart(product: any, quantity: any) {
    if (props.user || user) {
      const userUid = user ? user : props.user ? props.user : null;
      await addToCart(product, quantity, userUid);
    } else {
      await addToCart(product, quantity);
    }
  }

  useEffect(() => {
    if (process.env.TEST_KEY === `uwu`) {
    }
    fetchBestProducts();
  }, []);

  return (
    <>
      {/* <main></main> */}
      {/* Top of the Funnel */}
      <div className="bg-nf_green bg-opacity-5 bg-cover bg-[url(../public/landing_page.jpg)] mb-6 ">
        <div className="bg-opacity-50 bg-black container w-full max-w-full text-center py-20 ">
          <h2 className="mb-6 text-4xl font-bold text-center text-white">
            Personalized meal plans?
          </h2>
          <h3 className="my-4 text-2xl font-source text-white">
            More likely than you think!
          </h3>
          <Button
            text="Get started"
            round={true}
            headline={true}
            handleClick={navigateToSurvey}
          />
        </div>
      </div>
      {/* Discussion */}
      <div className="m-auto mb-6 px-32 py-6">
        <div className="mb-6">
          <h2 className="mb-6 text-4xl font-inter text-center text-black font-bold">
            Contents of a meal plan
          </h2>
          <p className="font-source text-gray-500 text-center">
            Each meal plan contains the recommended number of calories they
            should consume per day including the recommended meals and servings.
            It also contains the use of Herbalife products to help facilitate
            your wellness. You can find examples of possible meals below.
          </p>
        </div>
        <div className="grid grid-cols-4 grid-rows-1 gap-2 text-center items-center mb-6 text-black font-bitter">
          <Image
            src="/../public/oats.jpg"
            alt="oats"
            width={512}
            height={1024}
          ></Image>
          <Image
            src="/../public/banana.jpg"
            alt="oats"
            width={512}
            height={1024}
          ></Image>
          <Image
            src="/../public/rice.jpg"
            alt="oats"
            width={512}
            height={1024}
          ></Image>
          <Image
            src="/../public/salmon.jpg"
            alt="oats"
            width={512}
            height={1024}
          ></Image>
          <span>Breakfast</span>
          <span>Snacks</span>
          <span>Lunch</span>
          <span>Dinner</span>
        </div>
        <div className="">
          <p className="font-source text-gray-500 text-center">
            To help with preparing your meal plan, you can find the best sellers
            now!
          </p>
        </div>
      </div>
      <span className="h-1 w-full bg-gray-700 bg-opacity-50"></span>
      {/* Best Selling Products */}
      <div className="m-auto mb-6 px-32 py-6">
        <div className="bg-white">
          <div className="mx-auto px-4 py-6 w-full">
            <h2 className="mb-6 text-4xl font-bold text-center text-black">
              Best sellers
            </h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 ">
              {bestProducts.map((e: any, index: number) => {
                return (
                  <>
                    <ProductCard
                      productImage={e.images ? e.images[0] : null}
                      productName={e.name}
                      productPrice={e.price}
                      productId={e.id}
                      product={e}
                      handleAddToCart={handleAddToCart}
                    />
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <span className="h-1 w-full bg-gray-700 bg-opacity-50"></span>
      {/* Product Categories */}
      <div className="m-auto mb-6 px-32 pt-6">
        <div className="mx-auto px-4 py-6  w-full">
          <h2 className="mb-6 text-4xl font-bold text-center text-black">
            Categories
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 ">
            <div className="carousel w-full ">
              <div
                id={`slide${categoryIndex}`}
                className="carousel-item relative w-full justify-center items-center gap-4"
              >
                {/* Previous button */}
                <button
                  className="btn btn-circle hover:text-white hover:bp-opacity-50 hover:bg-gray-500 hover:bg-opacity-50 hover:border-none"
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
                  className="group grid grid-cols-1 grid-rows-2 gap-2"
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white">
                    <Image
                      className="h-full w-full object-cover object-center group-hover:opacity-75 max-w-64 max-h-64"
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
                  className="grid grid-cols-1 grid-rows-2 gap-2"
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white max-w-64 max-h-64">
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
                  className="grid grid-cols-1 grid-rows-2 gap-2"
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white max-w-64 max-h-64">
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
                {/* Next button */}
                <button
                  onClick={() => incrementCategoryIndex()}
                  className="btn btn-circle hover:text-white hover:bp-opacity-50 hover:bg-gray-500 hover:bg-opacity-50 hover:border-none"
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  let props: any = {
    searchString: "",
    user: null,
    cart: null,
    category: null,
    orders: null,
    isError: true,
    errorMessage: "Error with getting user info",
    redirect: "/login",
  };

  try {
    const cookies = nookies.get(context);

    if (cookies.token) {
      const token = await admin.auth().verifyIdToken(cookies.token);

      const { uid } = token;

      props.user = uid;
      props.isError = false;
      props.errorMessage = "";
      props.redirect = "/";
    }

    return { props };
  } catch (err) {
    props.errorMessage = "Error with getting user info";
    props.redirect = "/";

    return { props };
  }
}
