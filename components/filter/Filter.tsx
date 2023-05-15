import { useState } from "react";
import { PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY } from "../../firebase/constants";
import RadioButton from "../forms/RadioButton";
import InputComponent from "../forms/input/InputComponent";
import { useForm } from "react-hook-form";
import FilterPrice from "./FilterPrice";
import FilterStatus from "./FilterStatus";
import FilterBoolean from "./FilterBoolean";
import FilterRole from "./FilterRole";
import FilterCategory from "./FilterCategory";
import FilterProgram from "./FilterProgram";
import InputSubmit from "../forms/input/InputSubmit";

import { useRouter, usePathname, useParams } from "next/navigation";
import nookies from "nookies";

export default function Filter({
  handleFilters,
  resetFilter,
  isProductFilter,
  isOrderFilter,
  isCustomerFilter,
  isMessageFilter,
  isWellnessFilter,
}: {
  handleFilters: any;
  resetFilter: any;
  isProductFilter?: boolean;
  isOrderFilter?: boolean;
  isCustomerFilter?: boolean;
  isMessageFilter?: boolean;
  isWellnessFilter?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      inputCategory: "",
      inputMinPrice: 0,
      inputMaxPrice: 0,
      inputInStock: false,
      inputStatus: false,
      inputRole: false,
      inputProgram: "",
      inputReviewedByAdmin: false,
    },
  });

  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterMinPrice, setFilterMinPrice] = useState<number>(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(99999);
  const [filterInStock, setFilterInStock] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterRole, setFilterRole] = useState<string>("");

  const [filterProgram, setFilterProgram] = useState<string>("");
  const [filterReviewedByAdmin, setFilterReviewedByAdmin] =
    useState<boolean>(false);

  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const additionalParams = new URLSearchParams(params);

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

  function applyFilters(e: any) {
    console.log("filterCategory", filterCategory);
    console.log("filterMinPrice", filterMinPrice);
    console.log("filterMaxPrice", filterMaxPrice);
    console.log("filterInStock", filterInStock);
    console.log("filterStatus", filterStatus);
    console.log("filterRole", filterRole);
    console.log("filterProgram", filterProgram);
    console.log("filterReviewedByAdmin", filterReviewedByAdmin);

    e.preventDefault();
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
    } else if (isMessageFilter) {
      const filterObject = {
        status: filterStatus,
      };
      handleFilters(filterObject);
    } else if (isWellnessFilter) {
      const filterObject = {
        program: filterProgram,
        reviewed_by_admin: filterReviewedByAdmin,
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

    setFilterCategory("");
    setFilterMinPrice(0);
    setFilterMaxPrice(99999);
    setFilterInStock(true);
    setFilterStatus("");
    setFilterRole("");
    setFilterProgram("");
    setFilterReviewedByAdmin(false);

    PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.map((e) => {
      const filterCategoryRadioButton = document.getElementById(
        e
      ) as HTMLInputElement;
      if (filterCategoryRadioButton) {
        filterCategoryRadioButton.checked = false;
      }
    });

    const filterMinPriceInput = document.getElementById(
      "inputMinimumPrice"
    ) as HTMLInputElement;
    if (filterMinPriceInput) {
      filterMinPriceInput.valueAsNumber = 0;
    }

    const filterMaxPriceInput = document.getElementById(
      "inputMaximumPrice"
    ) as HTMLInputElement;
    if (filterMaxPriceInput) {
      filterMaxPriceInput.valueAsNumber = 99999;
    }

    [
      "gain",
      "maintenance",
      "loss",
      "customer",
      "admin",
      "inputInStockTrue",
      "inputInStockFalse",
      "inputReviewedByAdminTrue",
      "inputReviewedByAdminFalse",
    ].map((e) => {
      const filterRadioButtonInput = document.getElementById(
        e
      ) as HTMLInputElement;
      if (filterRadioButtonInput) {
        filterRadioButtonInput.checked = false;
      }
    });

    additionalParams.set("search", "");
    // router.replace(`/product?${additionalParams}`);
    nookies.set(undefined, "search", "", { path: "/" });
  }

  return (
    <>
      <div className="2xl:container 2xl:mx-auto">
        <div>
          <div>
            <button
              type="button"
              className="flex items-center justify-center px-5 py-2 w-auto text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 gap-x-2 hover:bg-nf_dark_blue float-right ml-2"
              onClick={() => handleResetFilters()}
              ml-2
            >
              Reset filters
            </button>
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
                      <form onSubmit={(e: any) => applyFilters(e)}>
                        <div className="m-2 w-full h-auto">
                          {isProductFilter ? (
                            <>
                              <div className="">
                                {/* Category Filter */}
                                <FilterCategory
                                  filterCategory={filterCategory}
                                  register={register}
                                  handleFilterCategory={setFilterCategory}
                                />
                                {/* Price Filter */}
                                <FilterPrice
                                  register={register}
                                  minimumPrice={filterMinPrice}
                                  maximumPrice={filterMaxPrice}
                                  handleMinPriceFunction={setFilterMinPrice}
                                  handleMaxPriceFunction={setFilterMaxPrice}
                                />

                                {/* In Stock Filter */}
                                <FilterBoolean
                                  register={register}
                                  type="inStock"
                                  handleFilterBoolean={setFilterInStock}
                                />
                              </div>
                            </>
                          ) : isOrderFilter ? (
                            <>
                              <div>
                                {/* Price Filter */}
                                <FilterPrice
                                  register={register}
                                  minimumPrice={filterMinPrice}
                                  maximumPrice={filterMaxPrice}
                                  handleMinPriceFunction={setFilterMinPrice}
                                  handleMaxPriceFunction={setFilterMaxPrice}
                                />
                                {/* Status Filter */}
                                <FilterStatus
                                  register={register}
                                  type="order"
                                  handleFilterStatus={setFilterStatus}
                                />
                              </div>
                            </>
                          ) : isCustomerFilter ? (
                            <>
                              <div>
                                {/* Role Filter */}
                                <FilterRole
                                  register={register}
                                  handleFilterRole={setFilterRole}
                                />
                              </div>
                            </>
                          ) : isMessageFilter ? (
                            <>
                              <div>
                                {/* Status Filter */}
                                <FilterStatus
                                  type="message"
                                  register={register}
                                  handleFilterStatus={setFilterStatus}
                                />
                              </div>
                            </>
                          ) : isWellnessFilter ? (
                            <>
                              <div>
                                {/* Program Filter */}
                                <FilterProgram
                                  register={register}
                                  handleFilterProgram={setFilterProgram}
                                />
                                {/* Reviewed By Admin Filter */}
                                <FilterBoolean
                                  register={register}
                                  type="reviewedByAdmin"
                                  handleFilterBoolean={setFilterReviewedByAdmin}
                                />
                              </div>
                            </>
                          ) : null}
                        </div>
                        <div className=" py-3 flex flex-row-reverse px-6">
                          <InputSubmit label="Apply filters" type="multiple" />
                          {/* <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-nf_green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-nf_dark_blue sm:ml-3 sm:w-auto"
                          onClick={() => applyFilters()}
                        >
                          Apply Filters
                        </button> */}
                          {/* <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800 sm:ml-3 sm:w-auto"
                            onClick={() => handleResetFilters()}
                          >
                            Reset filters
                          </button> */}
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => closeFilterSection()}
                          >
                            Close
                          </button>
                        </div>
                      </form>
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
