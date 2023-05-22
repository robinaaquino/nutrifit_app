import TableRowText from "./TableRowText";
import TableRowHeader from "./TableRowHeader";
import { useContext, useState, useEffect } from "react";
import { returnKeyByValue, formatDate } from "../../firebase/helpers";
import { useRouter } from "next/router";
import { useAuthContext, AuthContext } from "@/context/AuthContext";
import { deleteProductFunction } from "@/firebase/firebase_functions/products_functions";
import { deleteDocumentGivenTypeAndIdFunction } from "@/firebase/firebase_functions/general_functions";
import { CollectionsEnum } from "@/firebase/constants/enum_constants";

import InputSubmit from "../forms/input/InputSubmit";

export default function TableComponent({
  headers,
  contentKeys,
  content,
  type,
  isAdmin,
  disablePagination,
}: {
  headers: string[];
  contentKeys: string[];
  content: any[];
  type: string;
  isAdmin?: boolean;
  disablePagination?: boolean;
}) {
  const [itemList, setItemList] = useState<any[]>(content);
  var [currentItemList, setCurrentItemList] = useState<any[]>(
    content.slice(0, 25)
  );
  var [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;
  const maxPage =
    Math.ceil(itemList.length / pageSize) == 0
      ? 1
      : Math.ceil(itemList.length / pageSize);
  const router = useRouter();
  const authContextObject = useContext(AuthContext);
  const [sort, setSort] = useState(1);
  const [selectedElement, setSelectedElement] = useState<any>(null);

  const onPageChange = (page: number) => {
    var prevIndex = 0;
    var nextIndex = pageSize;
    if (page <= 1) {
      setCurrentPage(1);
    } else if (itemList.length <= pageSize * page) {
      setCurrentPage(maxPage);
      prevIndex = (maxPage - 1) * pageSize;
      nextIndex = pageSize * maxPage;
    } else {
      setCurrentPage(page);
      prevIndex = (page - 1) * pageSize;
      nextIndex = pageSize * page;
    }
    setCurrentItemList(itemList.slice(prevIndex, nextIndex));
  };

  const sortBy = (text: string) => {
    const key = returnKeyByValue(text) || "name";

    if (text == "First name" || text == "Last name") {
      let previousList = itemList;
      let newList = previousList.sort((a, b) =>
        a["shipping_details"][key] > b["shipping_details"][key]
          ? sort
          : b["shipping_details"][key] > a["shipping_details"][key]
          ? sort * -1
          : 0
      );
      setSort(sort * -1);
      setItemList(newList);
      onPageChange(currentPage);
    } else if (
      text == "updated_at" ||
      text == "created_at" ||
      text == "date_cleared"
    ) {
      let previousList = itemList;
      let newList = previousList.sort((a, b) =>
        new Date(a[key]) > new Date(b[key])
          ? sort
          : new Date(b[key]) > new Date(a[key])
          ? sort * -1
          : 0
      );
      setSort(sort * -1);
      setItemList(newList);
      onPageChange(currentPage);
    } else if (text == "date") {
      let previousList = itemList;
      let newList = previousList.sort((a, b) =>
        new Date(a["wellness_trainer_information"][key]) >
        new Date(b["wellness_trainer_information"][key])
          ? sort
          : new Date(b["wellness_trainer_information"][key]) >
            new Date(a["wellness_trainer_information"][key])
          ? sort * -1
          : 0
      );
      setSort(sort * -1);
      setItemList(newList);
      onPageChange(currentPage);
    } else {
      let previousList = itemList;
      let newList = previousList.sort((a, b) =>
        a[key] > b[key] ? sort : b[key] > a[key] ? sort * -1 : 0
      );
      setSort(sort * -1);
      setItemList(newList);
      onPageChange(currentPage);
    }
  };

  const deleteProduct = async (product: any) => {
    const result = await deleteProductFunction(product);

    if (result.isSuccess) {
      authContextObject.success(result.message);
      let previousProductList = itemList;

      for (let i = 0; i < itemList.length; i++) {
        if (product.id == itemList[i].id) {
          previousProductList.splice(i, 1);
          setItemList(previousProductList);
          break;
        }
      }

      onPageChange(currentPage);
    } else {
      authContextObject.error(result.message);
    }
  };

  const deleteOrder = async (order: any) => {
    const result = await deleteDocumentGivenTypeAndIdFunction(
      CollectionsEnum.ORDER,
      order.id
    );

    if (result.isSuccess) {
      authContextObject.success(result.message);
      let previousItemList = itemList;

      for (let i = 0; i < itemList.length; i++) {
        if (order.id == itemList[i].id) {
          previousItemList.splice(i, 1);
          setItemList(previousItemList);
          break;
        }
      }

      onPageChange(currentPage);
    } else {
      authContextObject.error(result.message);
    }
  };

  const deleteUser = async (user: any) => {
    const result = await deleteDocumentGivenTypeAndIdFunction(
      CollectionsEnum.USER,
      user.id
    );

    if (result.isSuccess) {
      authContextObject.success(result.message);
      let previousItemList = itemList;

      for (let i = 0; i < itemList.length; i++) {
        if (user.id == itemList[i].id) {
          previousItemList.splice(i, 1);
          setItemList(previousItemList);
          break;
        }
      }

      onPageChange(currentPage);
    } else {
      authContextObject.error(result.message);
    }
  };

  const deleteMessage = async (message: any) => {
    const result = await deleteDocumentGivenTypeAndIdFunction(
      CollectionsEnum.MESSAGE,
      message.id
    );

    if (result.isSuccess) {
      authContextObject.success(result.message);
      let previousItemList = itemList;

      for (let i = 0; i < itemList.length; i++) {
        if (message.id == itemList[i].id) {
          previousItemList.splice(i, 1);
          setItemList(previousItemList);
          break;
        }
      }
      onPageChange(currentPage);
    } else {
      authContextObject.error(result.message);
    }
  };

  const deleteWellnessResult = async (result: any) => {
    const deleteWellnessObject = await deleteDocumentGivenTypeAndIdFunction(
      CollectionsEnum.WELLNESS,
      result.id
    );

    if (deleteWellnessObject.isSuccess) {
      authContextObject.success(deleteWellnessObject.message);
      let previousItemList = itemList;

      for (let i = 0; i < itemList.length; i++) {
        if (result.id == itemList[i].id) {
          previousItemList.splice(i, 1);
          setItemList(previousItemList);
          break;
        }
      }

      onPageChange(currentPage);
    } else {
      authContextObject.error(result.message);
    }
  };

  function applyDelete(e: any) {
    e.preventDefault();
    const currentElement = selectedElement;
    if (type == "product") {
      deleteProduct(currentElement);
    } else if (type == "order") {
      deleteOrder(currentElement);
    } else if (type == "user") {
      deleteUser(currentElement);
    } else if (type == "message") {
      deleteMessage(currentElement);
    } else if (type == "wellness") {
      deleteWellnessResult(currentElement);
    }
    closeDeleteModalSection();
  }

  function closeDeleteModalSection() {
    var deleteSectionElement = document.getElementById("deleteSection");
    if (deleteSectionElement) {
      deleteSectionElement.classList.add("hidden");
    }
  }

  function showDeleteModalSection() {
    var deleteSectionElement = document.getElementById("deleteSection");
    if (deleteSectionElement) {
      if (deleteSectionElement.classList.contains("hidden")) {
        deleteSectionElement.classList.remove("hidden");
        deleteSectionElement.classList.add("block");
      } else {
        deleteSectionElement.classList.add("hidden");
      }
    }
  }

  useEffect(() => {
    if (content) {
      setItemList(content);
      if (content.length < pageSize) {
        setCurrentItemList(content);
      } else {
        setCurrentItemList(content.slice(0, pageSize));
      }
    }
  }, [content]);

  return (
    <>
      <div>
        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              {currentItemList.length > 0 ? (
                <div className="overflow-hidden border bg-nf_dark_blue ">
                  <table className="min-w-full divide-y divide-nf_dark_blue table-auto">
                    <thead className="bg-nf_green">
                      <tr className="w-auto">
                        {isAdmin ? (
                          <TableRowHeader
                            canSort={false}
                            text="Actions"
                            handleClick={() => {}}
                          />
                        ) : null}
                        {headers.map((e) => {
                          return (
                            <>
                              <TableRowHeader
                                text={e}
                                handleClick={() => {
                                  sortBy(e);
                                }}
                                canSort={true}
                              />
                            </>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-nf_dark_blue ">
                      {currentItemList.map((currentElement) => {
                        return (
                          <>
                            <tr className="">
                              {isAdmin ? (
                                <td className="flex mt-2 mx-2 justify-center">
                                  <button
                                    className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-nf_green rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-nf_dark_blue"
                                    onClick={() => {
                                      if (type == "product") {
                                        router.push(
                                          `/admin/product/${currentElement.id}`
                                        );
                                      } else if (type == "order") {
                                        router.push(
                                          `/admin/order/${currentElement.id}`
                                        );
                                      } else if (type == "user") {
                                        router.push(
                                          `/user/${currentElement.id}`
                                        );
                                      } else if (type == "message") {
                                        router.push(
                                          `/admin/message/${currentElement.id}`
                                        );
                                      } else if (type == "wellness") {
                                        router.push(
                                          `/admin/wellness/${currentElement.id}`
                                        );
                                      }
                                    }}
                                  >
                                    Edit
                                  </button>
                                  {type == "user" || type == "order" ? null : (
                                    <button
                                      className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-nf_dark_blue ml-2"
                                      onClick={(e: any) => {
                                        // applyDelete(e, currentElement);
                                        setSelectedElement(currentElement);
                                        showDeleteModalSection();
                                      }}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </td>
                              ) : null}
                              {contentKeys.map((key, index) => {
                                var currentText;
                                if (key == "first_name" || key == "last_name") {
                                  currentText =
                                    currentElement["shipping_details"][key];
                                } else if (
                                  key == "created_at" ||
                                  key == "updated_at" ||
                                  key == "date_cleared"
                                ) {
                                  currentText = formatDate(currentElement[key]);
                                } else if (key == "date") {
                                  if (
                                    currentElement[
                                      "wellness_trainer_information"
                                    ][key]
                                  ) {
                                    currentText = formatDate(
                                      currentElement[
                                        "wellness_trainer_information"
                                      ][key]
                                    );
                                  } else {
                                    currentText = currentElement[key];
                                  }
                                } else if (key == "reviewed_by_admin") {
                                  currentText = currentElement[key]
                                    ? "Reviewed"
                                    : "Unreviewed";
                                } else if (key == "program") {
                                  currentText = currentElement[key]
                                    ? currentElement[key]
                                    : "No assigned program";
                                } else {
                                  currentText = currentElement[key];
                                }

                                return (
                                  <>
                                    <TableRowText
                                      key={index}
                                      text={currentText}
                                      type={type}
                                      tableKey={key}
                                      isAdmin={isAdmin}
                                    />
                                  </>
                                );
                              })}
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-lg font-bold text-black bg-white">
                  {type == "order" ||
                  type == "product" ||
                  type == "user" ||
                  type == "message"
                    ? `No ${type}s`
                    : type == "sale"
                    ? "No sales per category"
                    : `No info for table of type ${type}`}
                </div>
              )}
            </div>
          </div>
        </div>
        {currentItemList.length > 0 && !disablePagination ? (
          <div className="mt-6 sm:flex sm:items-center sm:justify-between ">
            <div className="text-sm text-black ">
              Page{" "}
              <span className="font-medium text-black">
                {currentPage} of {maxPage}
              </span>
            </div>

            <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
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
        ) : null}
        <div
          className="relative z-10 hidden"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          id="deleteSection"
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
                          className="bi bi-trash text-red"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                        </svg>
                      </div>
                      <h3
                        className="ml-3 font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Are you sure you want to delete this item?
                      </h3>
                    </div>

                    <div className="mt-3 text-left ml-2">
                      <form onSubmit={(e: any) => applyDelete(e)}>
                        <div className=" py-3 flex flex-row-reverse px-6">
                          <InputSubmit label="Delete" type="multiple" />
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => closeDeleteModalSection()}
                          >
                            Cancel
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
    </>
  );
}
