import { useState } from "react";
import {
  RoleEnum,
  ProductCategoryEnum,
  OrderStatusEnum,
  PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY,
} from "../../firebase/constants";

export default function Filter({
  handleFilters,
  resetFilter,
  isProductFilter,
  isOrderFilter,
  isCustomerFilter,
}: {
  handleFilters: any;
  resetFilter: any;
  isProductFilter?: boolean;
  isOrderFilter?: boolean;
  isCustomerFilter?: boolean;
}) {
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterMinPrice, setFilterMinPrice] = useState<number>(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(99999);
  const [filterInStock, setFilterInStock] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("");

  function showFilters() {
    var fSection = document.getElementById("filterSection");
    if (fSection) {
      if (fSection.classList.contains("hidden")) {
        fSection.classList.remove("hidden");
        fSection.classList.add("block");
      } else {
        fSection.classList.add("hidden");
      }
    }
  }

  function applyFilters() {
    if (isProductFilter) {
      const filterObject = {
        category: filterCategory,
        minPrice: filterMinPrice,
        maxPrice: filterMaxPrice,
        inStock: filterInStock,
      };
      handleFilters(filterObject);
    } else if (isOrderFilter) {
      const filterObject = {
        minPrice: filterMinPrice,
        maxPrice: filterMaxPrice,
        status: filterStatus,
        //add delivery mode
        //add payment method
      };
      handleFilters(filterObject);
    } else if (isCustomerFilter) {
      const filterObject = {
        role: filterRole,
      };
      handleFilters(filterObject);
    }
    closeFilterSection();
  }

  function closeFilterSection() {
    var fSection = document.getElementById("filterSection");
    if (fSection) {
      fSection.classList.add("hidden");
    }
  }

  function handleResetFilters() {
    resetFilter();
    closeFilterSection();
  }

  return (
    <>
      <div className="2xl:container 2xl:mx-auto">
        {/* <div className="md:py-12 lg:px-20 md:px-6 py-9 px-4"> */}
        <div>
          {/* <p className="text-sm dark:text-gray-400 leading-3 text-gray-600 font-normal mb-2">
            Home - Men - Products - Filters
          </p> */}

          {/* Filters Button */}
          {/* <div className="flex justify-between items-center mb-4"> */}
          <div>
            {/* <h2 className="lg:text-4xl dark:text-white text-3xl lg:leading-9 leading-7 text-gray-800 font-semibold">
              Watches
            </h2> */}

            {/* <button
              onClick={() => showFilters()}
              className="cursor-pointer dark:bg-white dark:text-gray-800 text-white dark:hover:bg-gray-100 sm:flex hidden hover:bg-gray-700 focus:ring focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-4 px-6 bg-gray-800 flex text-base leading-4 font-normal text-white justify-center items-center absolute"
            >
              <img
                className="dark:hidden"
                src="https://tuk-cdn.s3.amazonaws.com/can-uploader/filter1-svg1.svg"
              />
              <img
                className="hidden dark:block"
                src="https://tuk-cdn.s3.amazonaws.com/can-uploader/filter1-svg1dark.svg"
              />
              Filters
            </button> */}
            <button
              className="flex items-center justify-center px-5 py-2 w-auto text-sm tracking-wide text-white transition-colors duration-200 bg-nf_green rounded-lg shrink-0 gap-x-2 hover:bg-nf_dark_blue float-right"
              onClick={() => showFilters()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-filter text-white"
                viewBox="0 0 16 16"
              >
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
              </svg>

              <span>Filters</span>
            </button>
          </div>
          {/* <p className="text-xl dark:text-gray-400 leading-5 text-gray-600 font-medium">
            09 Products
          </p> */}

          {/* <button
            onClick={() => showFilters()}
            className="cursor-pointer mt-6 block sm:hidden hover:bg-gray-700 focus:ring focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-2 w-full bg-gray-800 flex text-base leading-4 font-normal text-white dark:text-gray-800 dark:bg-white dark:hover:bg-gray-100 justify-center items-center"
          >
            <img
              className="dark:hidden"
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/filter1-svg1.svg"
              alt="filter"
            />
            <img
              className="hidden dark:block"
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/filter1-svg1dark.svg"
              alt="filter"
            />
            Filters
          </button> */}
        </div>

        <div
          className="relative z-10 hidden"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          id="filterSection"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-filter text-black"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-left ml-2">
                      <h3
                        className="text-base font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Filters
                      </h3>
                      {/* <form onSubmit={(e) => e.preventDefault()}> */}
                      <div className="m-2 w-auto h-auto">
                        {isProductFilter ? (
                          <>
                            <div>
                              {/* Category Filter */}
                              <div className="p-2">
                                <div className="flex text-black">
                                  {/* <img
                                    className="dark:hidden"
                                    src="https://tuk-cdn.s3.amazonaws.com/can-uploader/filter1-svg4.svg"
                                    alt="materials"
                                  />
                                  <img
                                    className="hidden dark:block"
                                    src="https://tuk-cdn.s3.amazonaws.com/can-uploader/filter1-svg4dark.svg"
                                    alt="materials"
                                  /> */}
                                  <p className="leading-5 text-sm font-bold">
                                    Category
                                  </p>
                                </div>
                                <div className="p-2">
                                  {PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.map(
                                    (e) => {
                                      return (
                                        <>
                                          <div className="flex space-x-2  items-center justify-start ">
                                            <input
                                              type="radio"
                                              id={e}
                                              name="productCategory"
                                              value={e}
                                              onChange={(event) =>
                                                setFilterCategory(
                                                  event.target.value
                                                )
                                              }
                                            />
                                            <div className="inline-block">
                                              <div className="flex space-x-6 justify-center items-center">
                                                <label
                                                  htmlFor={e}
                                                  className="mr-2 text-sm leading-3 font-normal text-black"
                                                >
                                                  {e}
                                                </label>
                                              </div>
                                            </div>

                                            <br />
                                          </div>
                                        </>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                              {/* Price Filter */}
                              <div className="pr-2 pt-2">
                                <div className="flex text-black">
                                  <p className="leading-5 text-sm font-bold">
                                    Price
                                  </p>
                                </div>
                                <div className="flex pt-2">
                                  <input
                                    type="number"
                                    className=" w-auto bg-white text-black "
                                    placeholder="Minimum price..."
                                    onChange={(event) =>
                                      setFilterMinPrice(
                                        parseInt(event.target.value)
                                      )
                                    }
                                  />
                                  <p className="text-black px-2 text-lg">-</p>
                                  <input
                                    type="number"
                                    className=" w-auto bg-white text-black "
                                    placeholder="Maximum price..."
                                    onChange={(event) =>
                                      setFilterMaxPrice(
                                        parseInt(event.target.value)
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* In Stock Filter */}
                              <div className="pr-2 pt-2">
                                <div className="flex text-black">
                                  <p className="leading-5 text-sm font-bold">
                                    In Stock
                                  </p>
                                </div>
                                <div className="flex pt-2">
                                  <div className="flex space-x-2  items-center justify-start">
                                    <input
                                      type="radio"
                                      id="yes"
                                      name="inStock"
                                      value="true"
                                      className=" w-auto bg-white text-black "
                                      onChange={(event) => {
                                        setFilterInStock(
                                          event.target.value == "true"
                                            ? true
                                            : false
                                        );
                                      }}
                                    />
                                    <div className="inline-block">
                                      <div className="flex space-x-6 justify-center items-center">
                                        <label
                                          htmlFor="yes"
                                          className="mr-2 text-sm leading-3 font-normal text-black"
                                        >
                                          Yes
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2  items-center justify-start">
                                    <input
                                      type="radio"
                                      id="no"
                                      name="inStock"
                                      value="false"
                                      className=" w-auto bg-white text-black "
                                      onChange={(event) => {
                                        setFilterInStock(
                                          event.target.value == "false"
                                            ? false
                                            : true
                                        );
                                      }}
                                    />
                                    <div className="inline-block">
                                      <div className="flex space-x-6 justify-center items-center">
                                        <label
                                          htmlFor="no"
                                          className="mr-2 text-sm leading-3 font-normal text-black"
                                        >
                                          No
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : isOrderFilter ? (
                          <>
                            <div>
                              {/* Price Filter */}
                              <div className="pr-2 pt-2">
                                <div className="flex text-black">
                                  <p className="leading-5 text-sm font-bold">
                                    Price
                                  </p>
                                </div>
                                <div className="flex pt-2">
                                  <input
                                    type="number"
                                    className=" w-auto bg-white text-black "
                                    placeholder="Minimum price..."
                                    onChange={(event) =>
                                      setFilterMinPrice(
                                        parseInt(event.target.value)
                                      )
                                    }
                                  />
                                  <p className="text-black px-2 text-lg">-</p>
                                  <input
                                    type="number"
                                    className=" w-auto bg-white text-black "
                                    placeholder="Maximum price..."
                                    onChange={(event) =>
                                      setFilterMaxPrice(
                                        parseInt(event.target.value)
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              {/* Status Filter */}
                              <div className="pr-2 pt-2">
                                <div className="flex text-black">
                                  <p className="leading-5 text-sm font-bold">
                                    Status
                                  </p>
                                </div>
                                <div className="flex pt-2">
                                  <div className="flex space-x-2  items-center justify-start">
                                    <input
                                      type="radio"
                                      id="pending"
                                      name="status"
                                      value="pending"
                                      className=" w-auto bg-white text-black "
                                      onChange={(event) =>
                                        setFilterStatus(event.target.value)
                                      }
                                    />
                                    <div className="inline-block">
                                      <div className="flex space-x-6 justify-center items-center">
                                        <label
                                          htmlFor="pending"
                                          className="mr-2 text-sm leading-3 font-normal text-black"
                                        >
                                          Pending
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2  items-center justify-start">
                                    <input
                                      type="radio"
                                      id="delivered"
                                      name="status"
                                      value="delivered"
                                      className=" w-auto bg-white text-black "
                                      onChange={(event) =>
                                        setFilterStatus(event.target.value)
                                      }
                                    />
                                    <div className="inline-block">
                                      <div className="flex space-x-6 justify-center items-center">
                                        <label
                                          htmlFor="delivered"
                                          className="mr-2 text-sm leading-3 font-normal text-black"
                                        >
                                          Delivered
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2  items-center justify-start">
                                    <input
                                      type="radio"
                                      id="cancelled"
                                      name="status"
                                      value="cancelled"
                                      className=" w-auto bg-white text-black "
                                      onChange={(event) =>
                                        setFilterStatus(event.target.value)
                                      }
                                    />
                                    <div className="inline-block">
                                      <div className="flex space-x-6 justify-center items-center">
                                        <label
                                          htmlFor="cancelled"
                                          className="mr-2 text-sm leading-3 font-normal text-black"
                                        >
                                          Cancelled
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : isCustomerFilter ? (
                          <>
                            <div>
                              {/* Role Filter */}
                              <div className="pr-2 pt-2">
                                <div className="flex text-black">
                                  <p className="leading-5 text-sm font-bold">
                                    Role
                                  </p>
                                </div>
                                <div className="flex pt-2">
                                  <div className="flex space-x-2  items-center justify-start">
                                    <input
                                      type="radio"
                                      id="customer"
                                      name="role"
                                      value="customer"
                                      className=" w-auto bg-white text-black "
                                      onChange={(event) =>
                                        setFilterRole(event.target.value)
                                      }
                                    />
                                    <div className="inline-block">
                                      <div className="flex space-x-6 justify-center items-center">
                                        <label
                                          htmlFor="customer"
                                          className="mr-2 text-sm leading-3 font-normal text-black"
                                        >
                                          Customer
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2  items-center justify-start">
                                    <input
                                      type="radio"
                                      id="admin"
                                      name="role"
                                      value="admin"
                                      className=" w-auto bg-white text-black "
                                      onChange={(event) =>
                                        setFilterRole(event.target.value)
                                      }
                                    />
                                    <div className="inline-block">
                                      <div className="flex space-x-6 justify-center items-center">
                                        <label
                                          htmlFor="admin"
                                          className="mr-2 text-sm leading-3 font-normal text-black"
                                        >
                                          Administrator
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-nf_green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-nf_dark_blue sm:ml-3 sm:w-auto"
                          onClick={() => applyFilters()}
                        >
                          Apply Filters
                        </button>
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800 sm:ml-3 sm:w-auto"
                          onClick={() => handleResetFilters()}
                        >
                          Reset filters
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => closeFilterSection()}
                        >
                          Close
                        </button>
                      </div>
                      {/* </form> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <style>
            .checkbox:checked + .check-icon {
                display: flex;
            }
        </style> */}
    </>
  );
}
