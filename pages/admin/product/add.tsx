import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import Image from "next/image";
// import no_image from "../../public/no_image.png";
import no_image from "public/no_image.png";
import {
  PRODUCT_CATEGORIES_ARRAY,
  ProductsDatabaseType,
} from "../../../firebase/constants";
import { addProductFunction } from "@/firebase/firebase_functions/products_function";
import { useRouter } from "next/navigation";
import { useAuthContext, AuthContext } from "@/context/AuthContext";
import nookies from "nookies";
import admin from "../../../firebase/admin-config";
import { getUserFunction } from "@/firebase/firebase_functions/users_function";

//clean authcontextobject calls
//clean getserversideprops calls for all admin routes
export default function AdminAddProduct(props: any) {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [productDescription, setProductDescription] = useState("");
  const [files, setFile] = useState<any>([]);
  const [message, setMessage] = useState("");
  const productImagesArray = [0, 1, 2, 3];

  const router = useRouter();
  const { error } = useAuthContext();
  const authContextObject = useContext(AuthContext);

  const handleForm = async (e: any) =>
    // event: any
    {
      e.preventDefault();
      const productObject: ProductsDatabaseType = {
        category: category,
        description: productDescription,
        price: price,
        quantity_left: quantity,
        name: productName,
        images: files,
      };
      const result = await addProductFunction(productObject);

      if (result.isSuccess) {
        authContextObject.success(result.resultText);
        router.push("/product");
      } else {
        authContextObject.error(result.resultText);
      }
    };

  const handleFile = (e: any) => {
    setMessage("");
    let file = e.target.files;

    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if (validImageTypes.includes(fileType)) {
        setFile([...files, file[i]]);
      } else {
        setMessage("only images accepted");
      }
    }
  };
  // const handleIndividualFile = (e: any, place: number) => {
  //   setMessage("");

  //   let file = e.target.file;

  //   const fileType = file["type"];
  //   const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  //   if (validImageTypes.includes(fileType)) {
  //     let previousArray = [...files];
  //     let item = previousArray[place];
  //     item = file;
  //     previousArray[place] = item;
  //     setFile(previousArray);
  //   } else {
  //     setMessage("only images accepted");
  //   }
  // };

  const removeImage = (i: any) => {
    setFile(files.filter((x: any) => x.name !== i));
  };

  if (props.isError) {
    error(props.errorMessage);
    router.push(props.redirect);
    return null;
  }

  return (
    <>
      <form
        onSubmit={handleForm}
        className="container mx-auto py-20 p-10 h-full w-full"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-product-name"
                >
                  Product Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-product-name"
                  type="text"
                  placeholder="Type your name..."
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              </div>
              {/* <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Last Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-last-name"
              type="text"
              placeholder="Doe"
            />
          </div> */}
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-category"
                >
                  Categories
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-category"
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {PRODUCT_CATEGORIES_ARRAY.map((category) => {
                      return (
                        <option value={category} key={category}>
                          {category}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-price"
                >
                  Price
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-price"
                  type="number"
                  placeholder="Type your price..."
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                  required
                />
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-quantity"
                >
                  Quantity
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-quantity"
                  type="number"
                  placeholder="Type your quantity..."
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
                />
                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-product-description"
                >
                  Product Description
                </label>
                <textarea
                  className="block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white h-full"
                  id="grid-product-description"
                  rows={3}
                  placeholder="Type your product description..."
                  onChange={(e) => setProductDescription(e.target.value)}
                  required
                />

                <p className="text-red-500 text-xs italic">
                  Please fill out this field.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="h-full">
              <div>Product Images</div>
              {/* {productImagesArray.map((key: any) => {
                console.log(files[key]);
                return (
                  <>
                    <input
                      type="file"
                      onChange={(e: any) => handleIndividualFile(e, key)}
                      className="h-full w-full bg-nf_green opacity-0 z-10 absolute"
                      multiple
                      name="file[]"
                    >
                      ( files[key] ?
                      <img
                        className="h-20 w-20 rounded-md"
                        src={URL.createObjectURL(files[key])}
                      />
                      {files[key]}
                      :
                      <Image
                        className="m-auto"
                        src={no_image}
                        alt="no image"
                        width="256"
                        height="256"
                      />
                      )
                    </input>
                  </>
                );
              })} */}
              <div className="h-screen flex justify-center items-center bg-gray-300 px-2">
                <div className="p-3 md:w-1/2 w-[360px] bg-white rounded-md">
                  <span className="flex justify-center items-center text-[12px] mb-1 text-red-500">
                    {message}
                  </span>
                  <div className="h-32 w-full relative border-2 items-center rounded-md cursor-pointer bg-gray-300 border-gray-400 border-dotted">
                    <input
                      type="file"
                      onChange={handleFile}
                      className="h-full w-full bg-green-200 opacity-0 z-10 absolute"
                      multiple
                      name="files[]"
                    />
                    <div className="h-full w-full bg-gray-200 absolute z-1 flex justify-center items-center top-0">
                      <div className="flex flex-col">
                        <i className="mdi mdi-folder-open text-[30px] text-gray-400 text-center"></i>
                        <span className="text-[12px]">{`Drag and Drop a file`}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {files.map((file: any, key: any) => {
                      return (
                        <div key={key} className="overflow-hidden relative">
                          <i
                            onClick={() => {
                              removeImage(file.name);
                            }}
                            className="mdi mdi-close absolute right-1 hover:text-white cursor-pointer"
                          ></i>
                          <img
                            className="h-20 w-20 rounded-md"
                            src={URL.createObjectURL(file)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <input
                type="submit"
                value="Add Product"
                className=" w-full cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
              />
            </div>
          </div>
        </div>

        {/* <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-password"
            >
              Password
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-password"
              type="password"
              placeholder="******************"
            />
            <p className="text-gray-600 text-xs italic">
              Make it as long and as crazy as you'd like
            </p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-city"
            >
              City
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-city"
              type="text"
              placeholder="Albuquerque"
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-state"
            >
              State
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
              >
                <option>New Mexico</option>
                <option>Missouri</option>
                <option>Texas</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="grid-zip"
            >
              Zip
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-zip"
              type="text"
              placeholder="90210"
            />
          </div>
        </div> */}
      </form>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    console.log("server side auth be like");
    const cookies = nookies.get(context);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    const a = await getUserFunction(uid);
    const isAdmin = a.result.role == "admin" ? true : false;

    if (!isAdmin) {
      // context.res.writeHead(302, { Location: "/login" });
      // context.res.end();

      return {
        props: {
          isError: true,
          errorMessage: "Unauthorized access",
          redirect: "/",
        },
      };
    }

    return {
      props: {
        message: `Your email is ${email} and your UID is ${uid}.`,
        authorized: isAdmin,
        isError: false,
        errorMessage: "",
        redirect: "",
      },
    };
  } catch (err) {
    // context.res.writeHead(302, { Location: "/login" });
    // context.res.end();

    return {
      props: {
        isError: true,
        errorMessage: "Unauthorized access",
        redirect: "/login",
      },
    };
  }
}
