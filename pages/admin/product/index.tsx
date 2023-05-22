import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import nookies from "nookies";

import { useAuthContext } from "@/context/AuthContext";
import admin from "../../../firebase/admin-config";

import {
  applyFilterFunction,
  applySearchFunction,
} from "@/firebase/firebase_functions/filter_and_search_functions";
import { ProductsDatabaseType } from "@/firebase/constants/product_constants";
import {
  getDocumentGivenTypeAndIdFunction,
  getAllDocumentsGivenTypeFunction,
} from "@/firebase/firebase_functions/general_functions";

import TableComponent from "@/components/admin/TableComponent";
import Filter from "@/components/filter/Filter";
import SearchBar from "@/components/universal/SearchBar";
import { CollectionsEnum } from "@/firebase/constants/enum_constants";
import { isUserAuthorizedFunction } from "@/firebase/firebase_functions/users_functions";

//clean getserversideprops calls for all admin routes
export default function AdminProduct(props: any) {
  const [products, setProducts] = useState<ProductsDatabaseType[]>([]);
  const [loading, setLoading] = useState(false);
  const { error } = useAuthContext();
  // const authContextObject = useContext(AuthContext);
  const router = useRouter();

  const tableHeaders: string[] = [
    "Name",
    "Category",
    "Quantity Sold",
    "Quantity Left",
    "Price",
    "Description",
    "Created at",
    "Last updated",
  ];
  const tableContentKeys: string[] = [
    "name",
    "category",
    "quantity_sold",
    "quantity_left",
    "price",
    "description",
    "created_at",
    "updated_at",
  ];

  async function fetchAllProducts() {
    setLoading(true);
    const result = await getAllDocumentsGivenTypeFunction(
      CollectionsEnum.PRODUCT
    );
    const productResult: ProductsDatabaseType[] =
      result.result as ProductsDatabaseType[];

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setProducts(productResult);
    }
    setLoading(false);
  }

  async function handleSearch(searchString: any) {
    const result = await applySearchFunction(
      CollectionsEnum.PRODUCT,
      searchString
    );

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setProducts(result.result);
    }
  }

  async function handleFilters(filter: any) {
    const result = await applyFilterFunction(CollectionsEnum.PRODUCT, filter);

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setProducts(result.result);
    }
  }

  useEffect(() => {
    fetchAllProducts();
  }, []);

  if (props.isError) {
    error(props.message);
    router.push(props.redirect);
    return null;
  }

  return (
    <>
      <div className="container px-4 mx-auto min-h-screen">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-x-3">
              {/* <button onClick={() => viewFilters()}>VIEW</button> */}
              {/* <button onClick={() => viewProducts()}>View Products</button> */}
              <h2 className="text-lg font-medium text-black ">Products</h2>

              <span className="px-3 py-1 text-xs text-white bg-nf_green rounded-full">
                {products.length}{" "}
                {products.length == 1 ? "product" : "products"}
              </span>
            </div>
          </div>

          <div className="flex items-center mt-4 gap-x-3">
            <SearchBar handleSearch={handleSearch} />
            <Filter
              handleFilters={handleFilters}
              isProductFilter={true}
              resetFilter={fetchAllProducts}
            />

            <button
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-nf_green rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-nf_dark_blue"
              onClick={() => {
                router.push("/admin/product/add");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>Add product</span>
            </button>
          </div>
        </div>

        <TableComponent
          headers={tableHeaders}
          contentKeys={tableContentKeys}
          content={products}
          type="product"
          isAdmin={true}
          loading={loading}
        />

        {/* <div className="mt-6 md:flex md:items-center md:justify-between">
          <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
            <button className="px-5 py-2 text-xs font-medium text-black transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
              View all
            </button>

            <button className="px-5 py-2 text-xs font-medium text-black transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
              Monitored
            </button>

            <button className="px-5 py-2 text-xs font-medium text-black transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
              Unmonitored
            </button>
          </div>

          <div className="relative flex items-center mt-4 md:mt-0">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mx-3 text-gray-400 dark:text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search"
              className="block w-full py-1.5 pr-5 text-black bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
        </div> */}
      </div>
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
        message: "Unauthenticated access",
        redirect: "/login",
      },
    };
  }
}
