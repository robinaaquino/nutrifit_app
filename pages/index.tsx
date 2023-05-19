import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import nookies from "nookies";

import no_image from "../public/no_image.png";
import digestive_health from "../public/digestive_health.jpg";
import enhancers from "../public/enhancers.jpg";
import heart_health from "../public/heart_health.jpg";
import personalized_weight_management from "../public/personalized_weight_management.jpg";
import sports_nutrition from "../public/sports_nutrition.jpg";
import targeted_nutrition from "../public/targeted_nutrition.jpg";
import skin from "../public/skin.jpg";
import vitamin_mask from "../public/vitamin_mask.jpg";

import oats from "../public/oats.jpg";
import banana from "../public/banana.jpg";
import rice from "../public/rice.jpg";
import salmon from "../public/salmon.jpg";

import admin from "../firebase/admin-config";

import { ProductCategoriesList } from "@/firebase/constants/product_constants";

import { getBestSellingProducts } from "@/firebase/firebase_functions/products_functions";

import Button from "@/components/common/Button";
import ProductCard from "@/components/product/ProductCard";

export default function Home(props: any) {
  const router = useRouter();
  const { user, success, error, addToCart, isAuthorized } = useAuthContext();
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [bestProducts, setBestProducts] = useState<any>([]);
  const categoryImages = {
    "Digestive Health": digestive_health,
    Enhancers: enhancers,
    "Heart Health": heart_health,
    "Personalized Weight Management": personalized_weight_management,
    "Sports Nutrition": sports_nutrition,
    "Targeted Nutrition": targeted_nutrition,
    Skin: skin,
    "Vitamin Mask": vitamin_mask,
  };

  function returnCategoryName(index: number) {
    if (index >= ProductCategoriesList.length) {
      return ProductCategoriesList[index - ProductCategoriesList.length];
    } else if (index < 0) {
      return ProductCategoriesList[ProductCategoriesList.length - index];
    } else {
      return ProductCategoriesList[index];
    }
  }

  function returnCategoryImage(index: number) {
    const categoryName = returnCategoryName(index);
    for (const [key, value] of Object.entries(categoryImages)) {
      if (key == categoryName) {
        return value;
      }
    }

    return no_image;
  }

  function decrementCategoryIndex() {
    if (categoryIndex <= 0) {
      let newCategoryIndex = ProductCategoriesList.length;
      setCategoryIndex(newCategoryIndex);
    } else {
      let newCategoryIndex = categoryIndex - 1;
      setCategoryIndex(newCategoryIndex);
    }
  }

  function incrementCategoryIndex() {
    if (categoryIndex > ProductCategoriesList.length) {
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
      error(result.message);
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
    fetchBestProducts();
  }, []);

  return (
    <>
      {/* <main></main> */}
      {/* Top of the Funnel */}
      <div className="bg-nf_green bg-opacity-5 bg-fill bg-[url(../public/landing_page.jpg)] mb-6 ">
        <div className="bg-opacity-50 bg-black container w-full max-w-full text-center py-20 ">
          <h2 className="mb-6 text-4xl font-bold text-center text-white">
            Personalized meal plans?
          </h2>
          <h3 className="my-4 text-2xl font-source text-white">
            More likely than you think!
          </h3>
          <Button
            text="Fill up your wellness survey"
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
          <Image src={oats} alt="oats" width={512} height={1024}></Image>
          <Image src={banana} alt="oats" width={512} height={1024}></Image>
          <Image src={rice} alt="oats" width={512} height={1024}></Image>
          <Image src={salmon} alt="oats" width={512} height={1024}></Image>
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
                      className="h-48 w-48 object-cover group-hover:opacity-75 max-w-64 max-h-64"
                      src={returnCategoryImage(categoryIndex)}
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
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white">
                    <Image
                      className="h-48 w-48 object-cover group-hover:opacity-75 max-w-64 max-h-64"
                      src={returnCategoryImage(categoryIndex + 1)}
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
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white">
                    <Image
                      className="h-48 w-48 object-cover group-hover:opacity-75 max-w-64 max-h-64"
                      src={returnCategoryImage(categoryIndex + 2)}
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
      <span className="h-1 w-full bg-gray-700 bg-opacity-50"></span>
      {/* Business Details */}
      <div className="m-auto mb-6 px-32 pt-6">
        <p>
          Nutrifit Wellness Hub is ran by Independent Herbalife Nutrition Member
          Melanie M. Laxamana
        </p>
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
    message: "Error with getting user info",
    redirect: "/login",
  };

  try {
    const cookies = nookies.get(context);

    if (cookies.token) {
      const token = await admin.auth().verifyIdToken(cookies.token);

      const { uid } = token;

      props.user = uid;
      props.isError = false;
      props.message = "";
      props.redirect = "/";
    }

    return { props };
  } catch (err) {
    props.message = "Error with getting user info";
    props.redirect = "/";

    return { props };
  }
}
