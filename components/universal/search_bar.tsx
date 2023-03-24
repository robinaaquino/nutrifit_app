import React from 'react';
import { MdSearch } from "react-icons/md";

export default function SearchBar() {
  return(
    <>
      <div className="flex items-center justify-between border border-white">
        <div className="text-4xl p-1"><MdSearch/></div>
        <input type="text" placeholder="Search..." className="w-full h-full "></input>
      </div>

    </>
  )
}

{/* <input type="text" id="search-navbar" class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."></input> */}