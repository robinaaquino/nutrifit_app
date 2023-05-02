import { useState, useEffect } from "react";
import Image from "next/image";
import no_image from "../../../public/no_image.png";
import nookies from "nookies";
import { useRouter } from "next/navigation";

export default function CarouselProduct({
  carouselName,
  items,
}: {
  carouselName: string;
  items: any[];
}) {
  const router = useRouter();
  const [itemIndex, setItemIndex] = useState(0);
  const [numberOfShownItems, setNumberOfShownItems] = useState(4);
  const [arrayOfNumber, setArrayOfNumber] = useState<number[]>([0, 1, 2, 3, 4]);

  const lengthOfContent = items.length;

  function returnItem(index: number) {
    if (index >= lengthOfContent) {
      return items[index - lengthOfContent];
    } else if (index < 0) {
      return items[lengthOfContent - index];
    } else {
      return items[index];
    }
  }

  function decrementItemIndex() {
    if (itemIndex <= 0) {
      let newItemIndex = lengthOfContent;
      setItemIndex(newItemIndex);
    } else {
      let newItemIndex = itemIndex - 1;
      setItemIndex(newItemIndex);
    }
  }

  function incrementItemIndex() {
    if (itemIndex > lengthOfContent) {
      let newItemIndex = 0;
      setItemIndex(newItemIndex);
    } else {
      let newItemIndex = itemIndex + 1;
      setItemIndex(newItemIndex);
    }
  }

  useEffect(() => {
    if (items.length < numberOfShownItems) {
      setNumberOfShownItems(items.length);
      setArrayOfNumber(
        Array.from({ length: items.length }, (value, index) => index)
      );
    }
  }, []);
  return (
    <>
      <div className="text-center">
        {/* <div className="container mx-auto px-6 text-center py-20 "> */}
        <div className="mx-auto p-2 w-full items-start-center">
          <h2 className="mb-12 text-4xl font-bold text-center text-black">
            {carouselName}
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 ">
            <div className="carousel w-full ">
              <div
                id={`slide${itemIndex}`}
                className="carousel-item relative w-full justify-center items-center gap-4"
              >
                {lengthOfContent > 3 ? (
                  <button
                    className="btn btn-circle"
                    onClick={() => decrementItemIndex()}
                  >
                    ❮
                  </button>
                ) : null}

                {lengthOfContent >= 1 ? (
                  <button
                    onClick={() => {
                      nookies.set(
                        undefined,
                        "category",
                        returnItem(itemIndex)["name"],
                        {
                          path: "/",
                        }
                      );
                      router.push("/product");
                    }}
                    className="group"
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                      <Image
                        className="h-full w-full object-cover object-center group-hover:opacity-75 "
                        src={
                          returnItem(itemIndex)["image"] &&
                          returnItem(itemIndex)["image"][0]
                            ? returnItem(itemIndex)["image"][0]
                            : no_image
                        }
                        alt="first item in carousel"
                        width="256"
                        height="256"
                      />
                    </div>
                    <h3 className="mt-4 text-lg text-gray-700 text-center">
                      {returnItem(itemIndex)["name"]}
                    </h3>
                    <p className="text-lg text-gray-500 text-center">
                      {carouselName == "Frequently bought products" ? (
                        <>
                          Quantity bought: {returnItem(itemIndex)["quantity"]}
                        </>
                      ) : carouselName == "Best selling products" ? (
                        <>
                          Total profit: {returnItem(itemIndex)["totalProfit"]}
                        </>
                      ) : null}
                    </p>
                  </button>
                ) : null}

                {lengthOfContent >= 2 ? (
                  <button
                    onClick={() => {
                      nookies.set(
                        undefined,
                        "category",
                        returnItem(itemIndex + 1)["name"],
                        {
                          path: "/",
                        }
                      );
                      router.push("/product");
                    }}
                    className="group"
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                      <Image
                        className="h-full w-full object-cover object-center group-hover:opacity-75 "
                        src={
                          returnItem(itemIndex + 1)["image"] &&
                          returnItem(itemIndex)["image"][0]
                            ? returnItem(itemIndex + 1)["image"][0]
                            : no_image
                        }
                        alt="middle item in carousel"
                        width="256"
                        height="256"
                      />
                    </div>
                    <h3 className="mt-4 text-lg text-gray-700 text-center">
                      {returnItem(itemIndex + 1)["name"]}
                    </h3>
                    <p className="text-lg text-gray-500 text-center">
                      {carouselName == "Frequently bought products" ? (
                        <>
                          Quantity bought:{" "}
                          {returnItem(itemIndex + 1)["quantity"]}
                        </>
                      ) : carouselName == "Best selling products" ? (
                        <>
                          Total profit:{" "}
                          {returnItem(itemIndex + 1)["totalProfit"]}
                        </>
                      ) : null}
                    </p>
                  </button>
                ) : null}

                {lengthOfContent >= 3 ? (
                  <button
                    onClick={() => {
                      nookies.set(
                        undefined,
                        "category",
                        returnItem(itemIndex + 2)["name"],
                        {
                          path: "/",
                        }
                      );
                      router.push("/product");
                    }}
                    className="group"
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-white xl:aspect-h-8 xl:aspect-w-7">
                      <Image
                        className="h-full w-full object-cover object-center group-hover:opacity-75 "
                        src={
                          returnItem(itemIndex + 2)["image"] &&
                          returnItem(itemIndex)["image"][0]
                            ? returnItem(itemIndex + 2)["image"][0]
                            : no_image
                        }
                        alt="last item in carousel"
                        width="256"
                        height="256"
                      />
                    </div>
                    <h3 className="mt-4 text-lg text-gray-700 text-center">
                      {returnItem(itemIndex + 2)["name"]}
                    </h3>
                    <p className="text-lg text-gray-500 text-center">
                      {carouselName == "Frequently bought products" ? (
                        <>
                          Quantity bought:{" "}
                          {returnItem(itemIndex + 2)["quantity"]}
                        </>
                      ) : carouselName == "Best selling products" ? (
                        <>
                          Total profit:{" "}
                          {returnItem(itemIndex + 2)["totalProfit"]}
                        </>
                      ) : null}
                    </p>
                  </button>
                ) : null}

                {lengthOfContent > 3 ? (
                  <button
                    onClick={() => incrementItemIndex()}
                    className="btn btn-circle"
                  >
                    ❯
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
