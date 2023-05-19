import Image from "next/image";
import no_image from "../../public/no_image.png";
import { useRouter } from "next/router";
import InputButton from "../forms/input/InputButton";

export default function ProductCard({
  productImage,
  productName,
  productPrice,
  productId,
  handleAddToCart,
  product,
}: {
  productImage: string;
  productName: string;
  productPrice: number;
  productId: string;
  handleAddToCart?: any;
  product: any;
}) {
  const router = useRouter();

  function handleClick() {
    handleAddToCart ? handleAddToCart(product, 1) : null;
  }
  return (
    <>
      <div>
        {/* <a href="#" className="block h-64 rounded-lg shadow-lg bg-white"></a> */}
        <div
          className="block h-64  rounded-lg shadow-lg bg-white cursor-pointer hover:opacity-70  overflow-hidden "
          onClick={() => {
            router.push(`/product/${productId}`);
          }}
        >
          {productImage ? (
            <Image
              className="m-auto object-cover"
              src={productImage}
              alt="Sunset in the mountains"
              width="1024"
              height="1024"
            />
          ) : (
            <Image
              className="m-auto"
              src={no_image}
              alt="Sunset in the mountains"
              width="256"
              height="256"
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-medium text-xl text-black">
              {productName}
            </span>
            <a className="flex items-center" href="#">
              <span className="flex items-center h-8 text-black text-lg rounded">
                Php {productPrice}
              </span>
            </a>
          </div>
          {handleAddToCart ? (
            <InputButton
              label={"Add to cart"}
              handleClick={handleClick}
              type="multiple"
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
