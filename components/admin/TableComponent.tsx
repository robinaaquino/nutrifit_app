import TableRowText from "./TableRowText";
import TableRowHeader from "./TableRowHeader";
import { useContext, useState, useEffect } from "react";
import { returnKeyByValue, formatDate } from "../../firebase/helpers";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthContext, AuthContext } from "@/context/AuthContext";
import { deleteProductFunction } from "@/firebase/firebase_functions/products_functions";
import { deleteOrderFunction } from "@/firebase/firebase_functions/orders_functions";
import { deleteUserFunction } from "@/firebase/firebase_functions/users_functions";
import { deleteMessageFunction } from "@/firebase/firebase_functions/messages_functions";
import { deleteWellnessSurveyResult } from "@/firebase/firebase_functions/wellness_functions";

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
      authContextObject.success(result.resultText);
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
      authContextObject.error(result.resultText);
    }
  };

  const deleteOrder = async (order: any) => {
    const result = await deleteOrderFunction(order.id);

    if (result.isSuccess) {
      authContextObject.success(result.resultText);
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
      authContextObject.error(result.resultText);
    }
  };

  const deleteUser = async (user: any) => {
    const result = await deleteUserFunction(user.id);

    if (result.isSuccess) {
      authContextObject.success(result.resultText);
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
      authContextObject.error(result.resultText);
    }
  };

  const deleteMessage = async (message: any) => {
    const result = await deleteMessageFunction(message.id);

    if (result.isSuccess) {
      authContextObject.success(result.resultText);
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
      authContextObject.error(result.resultText);
    }
  };

  const deleteWellnessResult = async (result: any) => {
    const deleteWellnessObject = await deleteWellnessSurveyResult(result.id);

    if (deleteWellnessObject.isSuccess) {
      authContextObject.success(deleteWellnessObject.resultText);
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
      authContextObject.error(result.resultText);
    }
  };

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
                                <td className="flex mt-2 mx-2">
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
                                          `/admin/user/${currentElement.id}`
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
                                  <button
                                    className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-red-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-nf_dark_blue ml-2"
                                    onClick={() => {
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
                                    }}
                                  >
                                    Delete
                                  </button>
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
      </div>
    </>
  );
}
