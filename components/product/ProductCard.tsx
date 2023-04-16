import Image from "next/image";
import no_image_2 from "../../public/no_image_2.png";
import { useRouter } from "next/router";

export default function ProductCard({
  productImage,
  productName,
  productPrice,
  productId,
}: {
  productImage: string;
  productName: string;
  productPrice: number;
  productId: string;
}) {
  const router = useRouter();
  return (
    <>
      <div>
        {/* <a href="#" className="block h-64 rounded-lg shadow-lg bg-white"></a> */}
        <div
          className="block h-64 rounded-lg shadow-lg bg-white cursor-pointer hover:opacity-70"
          onClick={() => {
            console.log("click");
            router.replace(`/product/${productId}`);
          }}
        >
          <Image
            className="m-auto"
            src={no_image_2}
            alt="Sunset in the mountains"
            width="256"
            height="256"
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-medium text-xl">{productName}</span>
            <a className="flex items-center" href="#">
              {/* <span className="text-xs font-medium text-gray-600">by</span>
              <span className="text-xs font-medium ml-1 text-indigo-500">
                Store Name
              </span> */}
              <span className="flex items-center h-8 text-black text-lg rounded">
                Php {productPrice}
              </span>
            </a>
          </div>
          <button className="flex items-center h-8  text-white px-2 rounded bg-nf_green hover:bg-nf_dark_blue text-lg">
            Add to cart
          </button>
          {/* <div className="flex items-center justify-between px-3 py-2">
            <button className="px-2 py-1 text-xs font-semibold text-white uppercase transition-colors duration-300 transform m-auto bg-nf_green hover:bg-nf_dark_blue">
              Add to cart
            </button>
          </div> */}
          {/* <span className="flex items-center h-8 bg-indigo-200 text-indigo-600 text-sm px-2 rounded">
            $34
          </span> */}
          {/* <div className="flex justify-between mt-3 item-center"> */}
          {/* <h1 className="text-lg font-bold text-gray-700 dark:text-gray-200 md:text-xl">
              $220
            </h1>
            <button className="px-2 py-1 text-xs font-bold text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-700 dark:focus:bg-gray-600">
              Add to Cart
            </button> */}
          {/* </div> */}
        </div>
      </div>
    </>
  );
}
