import TableRowText from "./TableRowText";
import TableRowHeader from "./TableRowHeader";
import { useContext, useState, useEffect } from "react";
import { returnKeyByValue } from "../../firebase/helpers";
import Link from "next/link";
import { useRouter } from "next/router";

export default function TableComponent({
  headers,
  contentKeys,
  content,
}: {
  headers: string[];
  contentKeys: string[];
  content: any[];
}) {
  const [productList, setProductList] = useState<any[]>(content);
  var [currentProductList, setCurrentProductList] = useState<any[]>(
    content.slice(0, 25)
    // content
  );
  var [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;
  const maxPage =
    Math.ceil(productList.length / pageSize) == 0
      ? 1
      : Math.ceil(productList.length / pageSize);
  const router = useRouter();

  const onPageChange = (page: number) => {
    var prevIndex = 0;
    var nextIndex = pageSize;
    if (page <= 1) {
      setCurrentPage(1);
    } else if (productList.length <= pageSize * page) {
      setCurrentPage(maxPage);
      prevIndex = (maxPage - 1) * pageSize;
      nextIndex = pageSize * maxPage;
    } else {
      setCurrentPage(page);
      prevIndex = (page - 1) * pageSize;
      nextIndex = pageSize * page;
    }
    setCurrentProductList(productList.slice(prevIndex, nextIndex));
  };

  //not working sort function
  const sortBy = (text: string) => {
    const key = returnKeyByValue(text) || "name";
    const newList = productList.sort((a, b) =>
      a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0
    );
  };
  useEffect(() => {
    if (content) {
      setProductList(content);
      if (content.length < pageSize) {
        setCurrentProductList(content);
      } else {
        setCurrentProductList(content.slice(0, 25));
      }
    }
  }, [content]);

  return (
    <>
      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            {currentProductList.length > 0 ? (
              <div className="overflow-hidden border bg-nf_dark_blue ">
                <table className="min-w-full divide-y divide-nf_dark_blue table-auto">
                  <thead className="bg-nf_green">
                    <tr className="w-full">
                      {headers.map((e) => {
                        return (
                          <>
                            <TableRowHeader
                              text={e}
                              handleClick={() => {
                                sortBy(e);
                              }}
                            />
                          </>
                        );
                      })}
                      <TableRowHeader text="Actions" handleClick={() => {}} />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-nf_dark_blue ">
                    {currentProductList.map((currentElement) => {
                      return (
                        <>
                          <tr className="">
                            {contentKeys.map((key) => {
                              const currentText = currentElement[key];
                              return (
                                <>
                                  <TableRowText text={currentElement[key]} />
                                </>
                              );
                            })}
                            <td>
                              <button
                                className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-nf_green rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-nf_dark_blue"
                                onClick={() => {
                                  router.push(
                                    `/admin/product/${currentElement.id}`
                                  );
                                }}
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        </>
                      );
                    })}

                    <tr>
                      {/* <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                          Customer
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 className="text-black ">Content curating app</h4>
                          <p className="text-black ">
                            Brings all your news into one place
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                            alt=""
                          />
                          <img
                            className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                            alt=""
                          />
                          <img
                            className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1256&q=80"
                            alt=""
                          />
                          <img
                            className="object-cover w-6 h-6 -mx-1 border-2 border-white rounded-full dark:border-gray-700 shrink-0"
                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                            alt=""
                          />
                          <p className="flex items-center justify-center w-6 h-6 -mx-1 text-xs text-blue-600 bg-blue-100 border-2 border-white rounded-full">
                            +4
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="w-48 h-1.5 bg-blue-200 overflow-hidden rounded-full">
                          <div className="bg-blue-500 w-2/3 h-1.5"></div>
                        </div>
                      </td> */}

                      {/* <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <button className="px-1 py-1 text-white transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              strokeLinejoin="round"
                              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                            />
                          </svg>
                        </button>
                      </td> */}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-lg font-bold text-black bg-white">
                No products{" "}
              </div>
            )}
          </div>
        </div>
      </div>

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
                stroke-linecap="round"
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
                stroke-linecap="round"
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
