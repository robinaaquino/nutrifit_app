import { MdFacebook } from "react-icons/md";


export default function Footer() {
  return (
    <>
      <div>
        <footer className="bg-nf_green px-2 sm:px-3 py-8 w-full flex items-center justify-between mt-auto">
          <div>
            <a href="#" className="flex items-end">
              <span className="font-inter text-sm text-white ml-3">Copyright 2023 Nutrifit Wellness Hub All rights reserved</span>
            </a>
          </div>

          <div>
            <a href="#">
              <span className="font-inter text-xl text-white font-bold ml-3">Contact Us</span>
            </a>
          </div>

          <div>
            <a href="#" className="text-4xl">
              <MdFacebook/>
            </a>

          </div>
        </footer>
      </div>
    </>
  )
}