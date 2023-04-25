import ProductCard from "@/components/product/ProductCard";
import { useEffect, useState, useContext } from "react";
import {
  getAllProductsFunction,
  getAllProductsWithFilterFunction,
  getAllProductsWithSearchFunction,
} from "@/firebase/firebase_functions/products_function";
import { ProductsDatabaseType } from "@/firebase/constants";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import admin from "../../firebase/admin-config";
import Filter from "@/components/universal/filter";

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
    const result = await getAllProductsWithFilterFunction(filter);
    if (!result.isSuccess) {
      authContextObject.error(result.resultText);
    } else {
      setProductList(result.result);
      onPageChange(currentPage, result.result);
    }
  }

  async function handleAddToCart(product: any, quantity: any) {
    if (props.user) {
      await authContextObject.addToCart(product, quantity, props.user);
    } else {
      await authContextObject.addToCart(product, quantity);
    }
  }
  async function fetchAllProducts() {
    if (props.searchString) {
      const result = await getAllProductsWithSearchFunction(props.searchString);

      if (!result.isSuccess) {
        authContextObject.error(result.resultText);
      } else {
        setProductList(result.result);
        setCurrentProductList(result.result.slice(0, pageSize));
      }
    } else {
      const result = await getAllProductsFunction();

      if (!result.isSuccess) {
        authContextObject.error(result.resultText);
      } else {
        setProductList(result.result);
        setCurrentProductList(result.result.slice(0, pageSize));
      }
    }
  }

  useEffect(() => {
    fetchAllProducts();
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
      {/* <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            <div className="lg:w-1/4 md:w-1/2 p-4 w-full">
              <a className="block relative h-48 rounded overflow-hidden">
                <img
                  alt="ecommerce"
                  className="object-cover object-center w-full h-full block"
                  src="https://dummyimage.com/420x260"
                />
              </a>
              <div className="mt-4">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                  CATEGORY
                </h3>
                <h2 className="text-gray-900 title-font text-lg font-medium">
                  The Catalyzer
                </h2>
                <p className="mt-1">$16.00</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <div className="flex flex-col w-screen min-h-screen p-10 bg-gray-100 text-gray-800">
        <h1 className="text-3xl">Product Category Page Title</h1>

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
          <button className="relative text-sm focus:outline-none group mt-4 sm:mt-0">
            <div className="flex items-center justify-between w-40 h-10 px-3 border-2 border-gray-300 rounded hover:bg-gray-300">
              <span className="font-medium">Popular</span>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="absolute z-10 flex-col items-start hidden w-full pb-1 bg-white shadow-lg rounded group-focus:flex">
              <a
                className="w-full px-4 py-2 text-left hover:bg-gray-200"
                href="#"
              >
                Popular
              </a>
              <a
                className="w-full px-4 py-2 text-left hover:bg-gray-200"
                href="#"
              >
                Featured
              </a>
              <a
                className="w-full px-4 py-2 text-left hover:bg-gray-200"
                href="#"
              >
                Newest
              </a>
              <a
                className="w-full px-4 py-2 text-left hover:bg-gray-200"
                href="#"
              >
                Lowest Price
              </a>
              <a
                className="w-full px-4 py-2 text-left hover:bg-gray-200"
                href="#"
              >
                Highest Price
              </a>
            </div>
          </button>
          <Filter
            handleFilters={handleFilters}
            isProductFilter={true}
            resetFilter={fetchAllProducts}
            // isOrderFilter={true}
            // isCustomerFilter={true}
          />
        </div>
        <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-12 w-full mt-6">
          {/* Product Tile Start */}
          {currentProductList?.length > 0 ? (
            currentProductList.map((product) => {
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
          ) : (
            <div className="text-center text-lg font-bold text-black bg-white">
              No products matched
            </div>
          )}
        </div>
        {/* <div>
          <a href="#" className="block h-64 rounded-lg shadow-lg bg-white"></a>
          <div className="flex items-center justify-between mt-3">
            <div>
              <a href="#" className="font-medium">
                Product Name
              </a>
              <a className="flex items-center" href="#">
                <span className="text-xs font-medium text-gray-600">by</span>
                <span className="text-xs font-medium ml-1 text-indigo-500">
                  Store Name
                </span>
              </a>
            </div>
            <span className="flex items-center h-8 bg-indigo-200 text-indigo-600 text-sm px-2 rounded">
              $34
            </span>
          </div>
        </div>
        <div>
          <a href="#" className="block h-64 rounded-lg shadow-lg bg-white"></a>
          <div className="flex items-center justify-between mt-3">
            <div>
              <a href="#" className="font-medium">
                Product Name
              </a>
              <a className="flex items-center" href="#">
                <span className="text-xs font-medium text-gray-600">by</span>
                <span className="text-xs font-medium ml-1 text-indigo-500">
                  Store Name
                </span>
              </a>
            </div>
            <span className="flex items-center h-8 bg-indigo-200 text-indigo-600 text-sm px-2 rounded">
              $34
            </span>
          </div>
        </div>
        <div>
          <a href="#" className="block h-64 rounded-lg shadow-lg bg-white"></a>
          <div className="flex items-center justify-between mt-3">
            <div>
              <a href="#" className="font-medium">
                Product Name
              </a>
              <a className="flex items-center" href="#">
                <span className="text-xs font-medium text-gray-600">by</span>
                <span className="text-xs font-medium ml-1 text-indigo-500">
                  Store Name
                </span>
              </a>
            </div>
            <span className="flex items-center h-8 bg-indigo-200 text-indigo-600 text-sm px-2 rounded">
              $34
            </span>
          </div>
        </div>
        <div>
          <a href="#" className="block h-64 rounded-lg shadow-lg bg-white"></a>
          <div className="flex items-center justify-between mt-3">
            <div>
              <a href="#" className="font-medium">
                Product Name
              </a>
              <a className="flex items-center" href="#">
                <span className="text-xs font-medium text-gray-600">by</span>
                <span className="text-xs font-medium ml-1 text-indigo-500">
                  Store Name
                </span>
              </a>
            </div>
            <span className="flex items-center h-8 bg-indigo-200 text-indigo-600 text-sm px-2 rounded">
              $34
            </span>
          </div>
        </div>
        <div>
          <a href="#" className="block h-64 rounded-lg shadow-lg bg-white"></a>
          <div className="flex items-center justify-between mt-3">
            <div>
              <a href="#" className="font-medium">
                Product Name
              </a>
              <a className="flex items-center" href="#">
                <span className="text-xs font-medium text-gray-600">by</span>
                <span className="text-xs font-medium ml-1 text-indigo-500">
                  Store Name
                </span>
              </a>
            </div>
            <span className="flex items-center h-8 bg-indigo-200 text-indigo-600 text-sm px-2 rounded">
              $34
            </span>
          </div>
        </div>
        <div>
          <a href="#" className="block h-64 rounded-lg shadow-lg bg-white"></a>
          <div className="flex items-center justify-between mt-3">
            <div>
              <a href="#" className="font-medium">
                Product Name
              </a>
              <a className="flex items-center" href="#">
                <span className="text-xs font-medium text-gray-600">by</span>
                <span className="text-xs font-medium ml-1 text-indigo-500">
                  Store Name
                </span>
              </a>
            </div>
            <span className="flex items-center h-8 bg-indigo-200 text-indigo-600 text-sm px-2 rounded">
              $34
            </span>
          </div>
        </div>
        <div>
          <a href="#" className="block h-64 rounded-lg shadow-lg bg-white"></a>
          <div className="flex items-center justify-between mt-3">
            <div>
              <a href="#" className="font-medium">
                Product Name
              </a>
              <a className="flex items-center" href="#">
                <span className="text-xs font-medium text-gray-600">by</span>
                <span className="text-xs font-medium ml-1 text-indigo-500">
                  Store Name
                </span>
              </a>
            </div>
            <span className="flex items-center h-8 bg-indigo-200 text-indigo-600 text-sm px-2 rounded">
              $34
            </span>
          </div>
        </div> */}
        <div className="flex justify-center mt-10 space-x-1">
          {/* <div className="flex items-center justify-center h-8 w-8 rounded text-gray-400">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <button
            className="flex items-center justify-center h-8 px-2 rounded text-sm font-medium text-gray-400"
            disabled
          >
            Prev
          </button> */}

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

          {/* <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 text-sm font-medium text-gray-600 hover:text-indigo-600">
            2
          </button>
          <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 text-sm font-medium text-gray-600 hover:text-indigo-600">
            3
          </button> */}
          {/* <button className="flex items-center justify-center h-8 px-2 rounded hover:bg-indigo-200 text-sm font-medium text-gray-600 hover:text-indigo-600">
            Next
          </button> */}
          {/* <button className="flex items-center justify-center h-8 w-8 rounded hover:bg-indigo-200 text-gray-600 hover:text-indigo-600">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button> */}
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
  try {
    const cookies = nookies.get(context);

    var searchString = "";
    if (cookies.search) {
      searchString = cookies.search;
    }

    if (cookies.token) {
      const token = await admin.auth().verifyIdToken(cookies.token);

      const { uid } = token;

      return {
        props: {
          searchString,
          user: uid,
          isError: false,
          errorMessage: "",
          redirect: "/",
        },
      };
    } else {
      if (cookies.cart) {
        return {
          props: {
            searchString,
            cart: JSON.parse(cookies.cart),
            isError: false,
            errorMessage: "",
            redirect: "/",
          },
        };
      } else {
        return {
          props: {
            searchString,
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
        searchString: "",
        user: null,
        isError: true,
        errorMessage: "Error with getting user info",
        redirect: "/login",
      },
    };
  }
}
