import React from "react";
import SearchBar from "./search_bar";
import { logout, useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRouter as nextRouter } from "next/router";
import nookies from "nookies";
import { useEffect } from "react";

//usecontext not resetting, dropdown of profile still reliant on isAuthorized of useAuthContext
export default function Header() {
  const { user, loading, isAuthorized, reset } = useAuthContext();
  const { pathname } = nextRouter();
  const router = useRouter();

  function handleSearch(text: string) {
    nookies.set(undefined, "search", text, { path: "/" });
    if (pathname == "/product") {
      router.replace("/product");
    } else {
      router.push("/product");
    }
  }

  return (
    <>
      <div>
        <div className="py-3 px-6 bg-nf_green flex justify-between items-center w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
            />
          </svg>
          <div className="ml-6 flex flex-1 gap-x-3">
            <Link href="/" className="flex items-end">
              <span className="font-inter text-4xl text-nf_yellow font-bold ml-3">
                Nutrifit
              </span>
              <span className="text-2xl font-bold font-inter ml-3 text-black">
                Wellness Hub
              </span>
            </Link>
          </div>

          <div className="flex flex-1 gap-x-3">
            {/* <input
              type="text"
              className="w-full rounded-md border border-nf_yellow px-3 py-2 text-sm max-w-lg bg-white"
              placeholder="Search..."
            /> */}
            <SearchBar handleSearch={handleSearch}></SearchBar>
          </div>

          <div className="ml-2 flex">
            <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-4 hover:bg-nf_dark_green">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-nf_yellow"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path
                  fillRule="evenodd"
                  d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <button
                onClick={() => router.push("/product")}
                className="text-xl font-inter text-white"
              >
                Products
              </button>
            </div>

            <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-4 hover:bg-nf_dark_green">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-nf_yellow"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                  3
                </span>
              </div>
              <button
                className="text-xl font-inter text-white"
                onClick={() => router.push("/cart")}
              >
                Cart
              </button>
            </div>

            <div className="dropdown">
              <div
                tabIndex={0}
                className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-4 hover:bg-nf_dark_green "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  className="h-6 w-6 text-nf_yellow"
                >
                  {" "}
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />{" "}
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />{" "}
                </svg>
                <span className="text-xl font-inter text-white">Profile</span>
              </div>
              {!user ? (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-nf_green rounded-box "
                >
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <Link href="/login">Login</Link>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <Link href="/signup">Sign up</Link>
                  </li>
                </ul>
              ) : !isAuthorized ? (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-nf_green rounded-box "
                >
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <Link href={"/user/" + user}>Profile</Link>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <Link href={"/wellness/add" + user}>Wellness Survey</Link>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <button
                      onClick={() => {
                        router.push("/");
                        logout();
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              ) : (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-nf_green rounded-box"
                >
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <Link href={"/user/" + user}>Profile</Link>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <Link href={"/wellness/add"}>Wellness Survey</Link>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <button
                      onClick={() => {
                        router.push("/admin/dashboard");
                      }}
                    >
                      Dashboard
                    </button>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <button
                      onClick={() => {
                        router.push("/admin/product");
                      }}
                    >
                      Products
                    </button>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <button
                      onClick={() => {
                        router.push("/admin/order");
                      }}
                    >
                      Orders
                    </button>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <button
                      onClick={() => {
                        router.push("/admin/user");
                      }}
                    >
                      Users
                    </button>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <button
                      onClick={() => {
                        router.push("/admin/message");
                      }}
                    >
                      Messages
                    </button>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <Link href={"/admin/wellness"}>Survey Results</Link>
                  </li>
                  <li className="text-white text-xl hover:bg-nf_dark_green rounded-lg ">
                    <button
                      onClick={() => {
                        router.push("/");
                        logout();
                        reset();
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
