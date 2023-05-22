import ProductCard from "@/components/product/ProductCard";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import nookies from "nookies";

import { AuthContext } from "@/context/AuthContext";
import admin from "../../firebase/admin-config";

import { getAllDocumentsGivenTypeFunction } from "@/firebase/firebase_functions/general_functions";
import {
  applyFilterFunction,
  applySearchFunction,
} from "@/firebase/firebase_functions/filter_and_search_functions";
import { ProductsDatabaseType } from "@/firebase/constants/product_constants";

import Filter from "@/components/filter/Filter";
import { CollectionsEnum } from "@/firebase/constants/enum_constants";
import Loading from "@/components/universal/loading";

export default function Catalog(props: any) {
  const [productList, setProductList] = useState<ProductsDatabaseType[]>([]);
  const authContextObject = useContext(AuthContext);
  const router = useRouter();
  var [currentProductList, setCurrentProductList] = useState<any[]>([]);
  var [currentPage, setCurrentPage] = useState(1);
  var [availablePages, setAvailablePages] = useState<number[]>([1, 2, 3]);
  const pageSize = 25;
  const maxPage =
    Math.ceil(productList.length / pageSize) == 0
      ? 1
      : Math.ceil(productList.length / pageSize);

  const [loading, setLoading] = useState(false);
  const [addCartLoading, setCartLoading] = useState(false);

  const onPageChange = (page: number, listOfProducts?: any) => {
    let listToUpdate = productList;
    if (listOfProducts) {
      listToUpdate = listOfProducts;
    }
    var prevIndex = 0;
    var nextIndex = pageSize;
    if (page <= 1) {
      setCurrentPage(1);
    } else if (listToUpdate.length <= pageSize * page) {
      setCurrentPage(maxPage);
      prevIndex = (maxPage - 1) * pageSize;
      nextIndex = pageSize * maxPage;
    } else {
      setCurrentPage(page);
      prevIndex = (page - 1) * pageSize;
      nextIndex = pageSize * page;
    }
    setCurrentProductList(listToUpdate.slice(prevIndex, nextIndex));
  };

  async function handleFilters(filter: any) {
    setLoading(true);
    const result = await applyFilterFunction(CollectionsEnum.PRODUCT, filter);
    if (!result.isSuccess) {
      authContextObject.error(result.message);
    } else {
      setProductList(result.result);
      onPageChange(currentPage, result.result);
    }
    setLoading(false);
  }

  async function handleAddToCart(product: any, quantity: any) {
    if (props.user) {
      await authContextObject.addToCart(product, quantity, props.user);
    } else {
      await authContextObject.addToCart(product, quantity);
    }
  }
  async function fetchAllProducts() {
    setLoading(true);
    if (props.searchString) {
      const result = await applySearchFunction(
        CollectionsEnum.PRODUCT,
        props.searchString
      );

      if (!result.isSuccess) {
        authContextObject.error(result.message);
      } else {
        setProductList(result.result);
        setCurrentProductList(result.result.slice(0, pageSize));
      }
    } else {
      const result = await getAllDocumentsGivenTypeFunction(
        CollectionsEnum.PRODUCT
      );
      const productResult: ProductsDatabaseType[] =
        result.result as ProductsDatabaseType[];

      if (!result.isSuccess) {
        authContextObject.error(result.message);
      } else {
        setProductList(productResult);
        setCurrentProductList(productResult.slice(0, pageSize));
      }
    }
    setLoading(false);
  }

  const sortBy = (text: string, order: string) => {
    var key = "quantity_sold";
    if (text == "popular") {
      key = "quantity_sold";
    } else if (text == "newest") {
      key = "created_at";
    } else if (text == "lowest_price" || text == "highest_price") {
      key = "price";
    }
    if (order == "desc") {
      let previousList = productList;
      let newList = previousList.sort((a: any, b: any) =>
        a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0
      );
      setProductList(newList);
      onPageChange(currentPage);
    } else {
      let previousList = productList;
      let newList = previousList.sort((a: any, b: any) =>
        a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0
      );
      setProductList(newList);
      onPageChange(currentPage);
    }
  };

  useEffect(() => {
    if (props.category) {
      handleFilters({
        category: props.category,
        minPrice: 0,
        maxPrice: 99999,
        inStock: true,
      });
      nookies.set(undefined, "category", "", {
        path: "/",
      });
    } else {
      fetchAllProducts();
    }
  }, [props]);

  useEffect(() => {
    var newPageList = [1, 2, 3];
    if (maxPage <= 3) {
      if (maxPage == 1) {
        newPageList = [1];
      } else if (maxPage == 2) {
        newPageList = [1, 2];
      } else if (maxPage == 3) {
        newPageList = [1, 2, 3];
      }
    } else {
      if (currentPage == maxPage) {
        newPageList = [currentPage - 2, currentPage - 1, currentPage];
      } else {
        newPageList = [currentPage - 1, currentPage, currentPage + 1];
      }
    }
    setAvailablePages(newPageList);
  }, [currentPage, maxPage, productList]);

  return (
    <>
      <div className="flex flex-col w-screen min-h-screen p-10 bg-gray-100 text-gray-800">
        <h1 className="text-3xl">Product Catalog</h1>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mt-6">
          {/* {incorrect logic in calculating indices} */}
          {/* <span className="text-sm font-semibold">
            {currentPage == 1 ? 1 : pageSize * currentPage}-{" "}
            {currentPage == 1 ? pageSize : pageSize * currentPage}{" "}
            {/* {currentPage == maxPage
              ? productList.length
              : (currentPage + 1) * pageSize}{" "}
            of {productList.length} products
          </span> */}
          <div className="relative text-sm focus:outline-none group mt-4 sm:mt-0">
            <select
              name="sortText"
              id="sortText"
              className="flex items-center justify-between w-40 h-10 px-3 border-2 bg-white border-gray-300 rounded hover:bg-gray-300"
              onChange={(e) => {
                if (e.target.value == "lowest_price") {
                  sortBy(e.target.value, "asc");
                } else {
                  sortBy(e.target.value, "desc");
                }
              }}
            >
              {/* <option value="blank" key="blank"></option> */}
              <option value="popular" key="popular">
                Popular
              </option>
              <option value="newest" key="newest">
                Newest
              </option>
              <option value="lowest_price" key="lowest_price">
                Lowest Price
              </option>
              <option value="highest_price" key="highest_price">
                Highest Price
              </option>
            </select>
          </div>
          <Filter
            handleFilters={handleFilters}
            isProductFilter={true}
            resetFilter={fetchAllProducts}
          />
        </div>
        <div>
          {loading ? (
            <Loading />
          ) : currentProductList?.length > 0 ? (
            <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-12 w-full mt-6">
              {/* Product Tile Start */}
              {currentProductList?.length > 0
                ? currentProductList.map((product) => {
                    return (
                      <>
                        <ProductCard
                          productImage={
                            product.images && product.images.length > 0
                              ? product.images[0]
                              : ""
                          }
                          productName={product.name}
                          productPrice={product.price}
                          productId={product.id ? product.id : ""}
                          product={product}
                          handleAddToCart={handleAddToCart}
                        />
                      </>
                    );
                  })
                : null}
            </div>
          ) : (
            <div className="text-center text-lg font-bold text-black w-full m-auto">
              No products matched
            </div>
          )}
        </div>

        <div className="flex justify-center mt-10 space-x-1">
          <button
            onClick={() => {
              onPageChange(currentPage - 1);
            }}
            disabled={currentPage == 1}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-white capitalize transition-colors duration-200 bg-nf_green border rounded-md sm:w-auto gap-x-2 disabled:bg-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
              />
            </svg>

            <span>previous</span>
          </button>
          {availablePages.map((e) => {
            return (
              <>
                {e == currentPage ? (
                  <button className="flex items-center justify-center h-8 w-8 rounded bg-nf_green text-sm font-medium text-white">
                    {e}
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center h-8 w-8 rounded  text-sm font-medium text-indigo-600"
                    onClick={() => onPageChange(e)}
                  >
                    {e}
                  </button>
                )}
              </>
            );
          })}

          <button
            onClick={() => {
              onPageChange(currentPage + 1);
            }}
            disabled={currentPage == maxPage}
            className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-white capitalize transition-colors duration-200 bg-nf_green border rounded-md sm:w-auto gap-x-2 disabled:bg-gray-500"
          >
            <span>Next</span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 rtl:-scale-x-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
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

    var searchString = "";
    props.searchString = searchString;

    if (cookies.search) {
      searchString = cookies.search;

      props.searchString = searchString;
      props.isError = false;
      props.message = "";
      props.redirect = "/";
    }

    if (cookies.cart) {
      props.cart = JSON.parse(cookies.cart);
      props.isError = false;
      props.message = "";
      props.redirect = "/";
    }

    if (cookies.category) {
      props.category = cookies.category;
      props.isError = false;
      props.message = "";
      props.redirect = "/";
    }

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
