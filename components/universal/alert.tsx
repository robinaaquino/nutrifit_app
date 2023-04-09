import React from "react";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
export default function Alert() {
  const authContextObject = useContext(AuthContext);

  useEffect(() => {
    setTimeout(authContextObject.clear, 30000);
  });
  return (
    <>
      {authContextObject.notification !== "" && (
        <>
          {authContextObject.notification == "success" ? (
            <>
              <div className="rounded-md bg-[#C4F9E2] sticky inset-x-0 top-0 translate-y-2 p-4 w-1/2 mx-auto">
                <div className="flex items-center text-sm font-medium text-[#004434]">
                  <span className="pr-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#00B078"></circle>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.1203 6.78954C14.3865 7.05581 14.3865 7.48751 14.1203 7.75378L9.12026 12.7538C8.85399 13.02 8.42229 13.02 8.15602 12.7538L5.88329 10.4811C5.61703 10.2148 5.61703 9.78308 5.88329 9.51682C6.14956 9.25055 6.58126 9.25055 6.84753 9.51682L8.63814 11.3074L13.156 6.78954C13.4223 6.52328 13.854 6.52328 14.1203 6.78954Z"
                        fill="white"
                      ></path>
                    </svg>
                  </span>
                  <div className="flex w-full items-center justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-medium text-black">
                        Success
                      </h3>
                      <p className="text-body-color text-sm">
                        {authContextObject.notificationText}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          authContextObject.clear();
                        }}
                        className="hover:text-danger text-[#ACACB0]"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          className="fill-current"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.8839 5.11612C19.372 5.60427 19.372 6.39573 18.8839 6.88388L6.88388 18.8839C6.39573 19.372 5.60427 19.372 5.11612 18.8839C4.62796 18.3957 4.62796 17.6043 5.11612 17.1161L17.1161 5.11612C17.6043 4.62796 18.3957 4.62796 18.8839 5.11612Z"
                          ></path>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.11612 5.11612C5.60427 4.62796 6.39573 4.62796 6.88388 5.11612L18.8839 17.1161C19.372 17.6043 19.372 18.3957 18.8839 18.8839C18.3957 19.372 17.6043 19.372 17.1161 18.8839L5.11612 6.88388C4.62796 6.39573 4.62796 5.60427 5.11612 5.11612Z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-md bg-[#FFF0F0] sticky inset-x-0 top-0 translate-y-2 p-4 w-1/2 mx-auto">
                <div className="flex items-center text-sm font-medium text-[#004434]">
                  <span className="pr-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="#BC1C21"></circle>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.1203 6.78954C14.3865 7.05581 14.3865 7.48751 14.1203 7.75378L9.12026 12.7538C8.85399 13.02 8.42229 13.02 8.15602 12.7538L5.88329 10.4811C5.61703 10.2148 5.61703 9.78308 5.88329 9.51682C6.14956 9.25055 6.58126 9.25055 6.84753 9.51682L8.63814 11.3074L13.156 6.78954C13.4223 6.52328 13.854 6.52328 14.1203 6.78954Z"
                        fill="white"
                      ></path>
                    </svg>
                  </span>
                  <div className="flex w-full items-center justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-medium text-black">
                        Error
                      </h3>
                      <p className="text-body-color text-sm">
                        {authContextObject.notificationText}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => {
                          authContextObject.clear();
                        }}
                        className="hover:text-danger text-[#ACACB0]"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          className="fill-current"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.8839 5.11612C19.372 5.60427 19.372 6.39573 18.8839 6.88388L6.88388 18.8839C6.39573 19.372 5.60427 19.372 5.11612 18.8839C4.62796 18.3957 4.62796 17.6043 5.11612 17.1161L17.1161 5.11612C17.6043 4.62796 18.3957 4.62796 18.8839 5.11612Z"
                          ></path>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.11612 5.11612C5.60427 4.62796 6.39573 4.62796 6.88388 5.11612L18.8839 17.1161C19.372 17.6043 19.372 18.3957 18.8839 18.8839C18.3957 19.372 17.6043 19.372 17.1161 18.8839L5.11612 6.88388C4.62796 6.39573 4.62796 5.60427 5.11612 5.11612Z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
