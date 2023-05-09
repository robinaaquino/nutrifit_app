import { useState } from "react";
import {
  RoleEnum,
  ProductCategoryEnum,
  OrderStatusEnum,
  PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY,
} from "../../firebase/constants";
import RadioButton from "../forms/RadioButton";

export default function Filter({
  handleFilters,
  resetFilter,
  isProductFilter,
  isOrderFilter,
  isCustomerFilter,
  isMessageFilter,
}: {
  handleFilters: any;
  resetFilter: any;
  isProductFilter?: boolean;
  isOrderFilter?: boolean;
  isCustomerFilter?: boolean;
  isMessageFilter?: boolean;
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
      console.log("filter object order:", filterObject);
      handleFilters(filterObject);
    } else if (isCustomerFilter) {
      const filterObject = {
        role: filterRole,
      };
      handleFilters(filterObject);
    } else if (isMessageFilter) {
      const filterObject = {
        status: filterStatus,
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
            <div className="flex min-h-full justify-center p-4 text-center items-center ">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 max-w-full min-w-full">
                  <div className="">
                    <div className="flex items-center ">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 ">
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
                      <h3
                        className="ml-3 font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Filters
                      </h3>
                    </div>

                    <div className="mt-3 text-left ml-2">
                      {/* <form onSubmit={(e) => e.preventDefault()}> */}
                      <div className="m-2 w-full h-auto">
                        {isProductFilter ? (
                          <>
                            <div className="">
                              {/* Category Filter */}
                              <div className="p-2">
                                <div className="flex text-black">
                                  <p className="leading-5 text-sm font-bold">
                                    Category
                                  </p>
                                </div>
                                <div className="p-2">
                                  {PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.map(
                                    (e) => {
                                      return (
                                        <>
                                          <RadioButton
                                            name={"productCategory"}
                                            id={e}
                                            value={e}
                                            handleInput={setFilterCategory}
                                            label={e}
                                          />
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
                                    className="w-full bg-white text-black "
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
                                    className=" w-full bg-white text-black "
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
                                  <RadioButton
                                    name={"inStock"}
                                    id={"yes"}
                                    value={"true"}
                                    label={"True"}
                                    handleInput={setFilterInStock}
                                    isBoolean={true}
                                  />

                                  <RadioButton
                                    name={"inStock"}
                                    id={"no"}
                                    value={"false"}
                                    label={"False"}
                                    handleInput={setFilterInStock}
                                    isBoolean={true}
                                  />
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
                                    className="w-full bg-white text-black "
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
                                    className=" w-full bg-white text-black "
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
                                  <RadioButton
                                    name={"status"}
                                    id={"pending"}
                                    value={"pending"}
                                    label={"Pending"}
                                    handleInput={setFilterStatus}
                                  />

                                  <RadioButton
                                    name={"status"}
                                    id={"delivered"}
                                    value={"delivered"}
                                    label={"Delivered"}
                                    handleInput={setFilterStatus}
                                  />

                                  <RadioButton
                                    name={"status"}
                                    id={"cancelled"}
                                    value={"cancelled"}
                                    label={"Cancelled"}
                                    handleInput={setFilterStatus}
                                  />
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
                                  <RadioButton
                                    name={"role"}
                                    id={"customer"}
                                    value={"customer"}
                                    label={"Customer"}
                                    handleInput={setFilterRole}
                                  />

                                  <RadioButton
                                    name={"role"}
                                    id={"admin"}
                                    value={"admin"}
                                    label={"Admin"}
                                    handleInput={setFilterRole}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : isMessageFilter ? (
                          <>
                            <div>
                              {/* Status Filter */}
                              <div className="pr-2 pt-2">
                                <div className="flex text-black">
                                  <p className="leading-5 text-sm font-bold">
                                    Status
                                  </p>
                                </div>
                                <div className="flex pt-2">
                                  <RadioButton
                                    name={"messageType"}
                                    id={"unread"}
                                    value={"unread"}
                                    label={"Unread"}
                                    handleInput={setFilterStatus}
                                  />
                                  <RadioButton
                                    name={"messageType"}
                                    id={"replied"}
                                    value={"replied"}
                                    label={"Replied"}
                                    handleInput={setFilterStatus}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                      <div className=" py-3 flex flex-row-reverse px-6">
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
