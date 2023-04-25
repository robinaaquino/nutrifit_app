import TableComponent from "@/components/admin/TableComponent";
import { useEffect, useState, useContext } from "react";
import {
  getAllProductsFunction,
  getAllProductsWithFilterFunction,
  getAllProductsWithSearchFunction,
} from "@/firebase/firebase_functions/products_function";
import { ProductsDatabaseType } from "@/firebase/constants";
import { AuthContext, useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import admin from "../../../firebase/admin-config";
import { getUserFunction } from "@/firebase/firebase_functions/users_function";
import Filter from "@/components/universal/filter";
import SearchBar from "@/components/universal/search_bar";

//clean getserversideprops calls for all admin routes
export default function AdminProduct(props: any) {
  const [products, setProducts] = useState<ProductsDatabaseType[]>([]);
  const { error, loading } = useAuthContext();
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
    const result = await getAllProductsFunction();

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setProducts(result.result);
    }
  }

  async function handleSearch(searchString: any) {
    const result = await getAllProductsWithSearchFunction(searchString);

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setProducts(result.result);
    }
  }

  async function handleFilters(filter: any) {
    const result = await getAllProductsWithFilterFunction(filter);

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setProducts(result.result);
    }
  }

  function viewProducts() {
    console.log(products);
  }

  // const updateProductsViaFilter = async (filter: any) => {
  //   console.log("Updating products via filters: ", filter);
  //   // viewFilters();
  //   console.log("Viewing filters...");
  //   console.log("in stock: ", filter.inStock);
  //   console.log("cat: ", filter.category);
  //   console.log("min: ", filter.minPrice);
  //   console.log("max: ", filter.maxPrice);
  // };

  // function viewFilters() {
  //   console.log("Viewing filters...");
  //   console.log("in stock: ", inStock);
  //   console.log("cat: ", category);
  //   console.log("min: ", minPrice);
  //   console.log("max: ", maxPrice);
  // }

  const handleForm = async (e: any) => {};

  const a = ["asd", "asda", "Asda"];

  useEffect(() => {
    fetchAllProducts();
  }, []);

  if (props.isError) {
    error(props.errorMessage);
    router.push(props.redirect);
    return null;
  }

  return (
    <>
      <div className="container px-4 mx-auto">
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

            {/* <p className="mt-1 text-sm text-white dark:text-gray-300">
              These companies have purchased in the last 12 months.
            </p> */}
          </div>

          <div className="flex items-center mt-4 gap-x-3">
            {/* <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-black transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100  dark:border-gray-700">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_3098_154395)">
                  <path
                    d="M13.3333 13.3332L9.99997 9.9999M9.99997 9.9999L6.66663 13.3332M9.99997 9.9999V17.4999M16.9916 15.3249C17.8044 14.8818 18.4465 14.1806 18.8165 13.3321C19.1866 12.4835 19.2635 11.5359 19.0351 10.6388C18.8068 9.7417 18.2862 8.94616 17.5555 8.37778C16.8248 7.80939 15.9257 7.50052 15 7.4999H13.95C13.6977 6.52427 13.2276 5.61852 12.5749 4.85073C11.9222 4.08295 11.104 3.47311 10.1817 3.06708C9.25943 2.66104 8.25709 2.46937 7.25006 2.50647C6.24304 2.54358 5.25752 2.80849 4.36761 3.28129C3.47771 3.7541 2.70656 4.42249 2.11215 5.23622C1.51774 6.04996 1.11554 6.98785 0.935783 7.9794C0.756025 8.97095 0.803388 9.99035 1.07431 10.961C1.34523 11.9316 1.83267 12.8281 2.49997 13.5832"
                    stroke="currentColor"
                    strokeWidth="1.67"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3098_154395">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span>Import</span>
            </button> */}
            <SearchBar handleSearch={handleSearch} />
            <Filter
              handleFilters={handleFilters}
              isProductFilter={true}
              resetFilter={fetchAllProducts}
              // isOrderFilter={true}
              // isCustomerFilter={true}
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

// export async function getStaticProps(context: any) {
//   return {
//     props: {
//       protected: true,
//       isAuthorized: true,
//     },
//   };
// }

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
