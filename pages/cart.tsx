import { useAuthContext } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import nookies from "nookies";
import admin from "../firebase/admin-config";
import {
  getCartViaIdFunction,
  clearCartFunction,
} from "@/firebase/firebase_functions/cart_function";
import Image from "next/image";
import { getUserFunction } from "@/firebase/firebase_functions/users_function";
import {
  OrdersDatabaseType,
  PaymentMethodEnum,
  OrderStatusEnum,
} from "@/firebase/constants";
import { addOrderFunction } from "@/firebase/firebase_functions/orders_functions";
import { useRouter } from "next/navigation";
import RadioButton from "@/components/forms/RadioButton";

import { useForm } from "react-hook-form";
import WarningMessage from "@/components/forms/WarningMessage";

export default function Cart(props: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("pickup");
  const [notes, setNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(
    PaymentMethodEnum.BLANK
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      inputFirstName: "",
      inputLastName: "",
      inputContactNumber: "",
      inputAddress: "",
      inputCity: "",
      inputProvince: "",
      inputDeliveryMode: "pickup",
      inputNotes: "",
    },
  });

  const [cartContents, setCartContents] = useState<any>(null);
  const {
    deleteCartInCookiesAndContext,
    cart,
    removeFromCart,
    error,
    success,
    user,
  } = useAuthContext();
  const router = useRouter();

  async function fetchCarts() {
    if (props.cart) {
      //if cart exists in cookies
      setCartContents(props.cart);
    } else {
      if (cart) {
        //check cart in context
        setCartContents(cart);
      } else {
        let newCart: any = {
          created_at: new Date().toString(),
          products: [],
          subtotal_price: 0,
          updated_at: new Date().toString(),
          user_id: null,
        };

        setCartContents(newCart);
      }
    }
  }

  function handleRemoveFromCart(product: any) {
    var previousCart = cartContents;
    for (let i = 0; i < previousCart.products.length; i++) {
      if (product.id == previousCart.products[i].id) {
        previousCart.products.splice(i, 1);
      }
    }
    previousCart.subtotal_price =
      previousCart.subtotal_price - product.price * product.quantity;
    previousCart.updated_at = new Date().toString();
    setCartContents(previousCart);
    removeFromCart(product);
  }

  const handleFormForPayment = async (data: any, e: any) => {
    const {
      inputFirstName,
      inputLastName,
      inputContactNumber,
      inputAddress,
      inputCity,
      inputProvince,
      inputDeliveryMode,
      inputNotes,
    } = data;
    if (cartContents != null && cartContents.products.length > 0) {
      const shipping_details = {
        address: inputAddress,
        first_name: inputFirstName,
        last_name: inputLastName,
        city: inputCity,
        province: inputProvince,
        contact_number: inputContactNumber,
      };

      const orderDetails: OrdersDatabaseType = {
        total_price: cartContents.subtotal_price,
        payment: {
          created_at: new Date().toString(),
          date_cleared: "",
          payment_method: paymentMethod
            ? paymentMethod
            : PaymentMethodEnum.BLANK,
          price_paid: 0,
          updated_at: new Date().toString(),
        },
        products: cartContents.products,
        status: OrderStatusEnum.PENDING,

        user_id: props.user ? props.user : "",
        note: inputNotes,
        delivery_mode: inputDeliveryMode,
        shipping_details: shipping_details,
      };

      const result = await addOrderFunction(orderDetails);

      if (result.isSuccess) {
        success(result.resultText);
        router.push(`/order/${result.result.id}`);
        nookies.set(undefined, "order", JSON.stringify(result.result));

        if (props.user || user) {
          const clearCartResult = await clearCartFunction(props.user || user);

          if (clearCartResult.isSuccess) {
            deleteCartInCookiesAndContext();
          } else {
            error(result.resultText);
          }
        } else {
          deleteCartInCookiesAndContext();
        }
      } else {
        error(result.resultText);
      }
    } else {
      error("No items in cart");
    }
    e.preventDefault();
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <>
      <div className="container p-12 mx-auto">
        <div className="flex flex-col w-full px-0 mx-auto md:flex-row">
          <div className="flex flex-col w-2/5">
            <h2 className="mb-4 font-bold md:text-xl text-heading text-black">
              Shipping Address and Contact Details
            </h2>
            <form
              className="justify-center w-full mx-auto"
              onSubmit={handleSubmit(handleFormForPayment)}
            >
              <div className="">
                <div className="space-x-0 lg:flex lg:space-x-4">
                  <div className="w-full lg:w-1/2">
                    <label
                      htmlFor="firstName"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      {...register("inputFirstName", {
                        required: "First name is required",
                        onChange: (e: any) => setFirstName(e.target.value),
                      })}
                      aria-invalid={errors.inputFirstName ? "true" : "false"}
                    />
                  </div>
                  {errors.inputFirstName && (
                    <WarningMessage text={errors.inputFirstName?.message} />
                  )}
                  <div className="w-full lg:w-1/2 ">
                    <label
                      htmlFor="firstName"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      {...register("inputLastName", {
                        required: "Last name is required",
                        onChange: (e: any) => setLastName(e.target.value),
                      })}
                      aria-invalid={errors.inputLastName ? "true" : "false"}
                    />
                  </div>
                  {errors.inputLastName && (
                    <WarningMessage text={errors.inputLastName?.message} />
                  )}
                </div>
                <div className="mt-4">
                  <div className="w-full">
                    <label
                      htmlFor="contactNumber"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      Contact Number
                    </label>
                    <input
                      type="text"
                      placeholder="Contact number"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      {...register("inputContactNumber", {
                        required: "Contact number is required",
                        onChange: (e: any) => setContactNumber(e.target.value),
                      })}
                      aria-invalid={
                        errors.inputContactNumber ? "true" : "false"
                      }
                    />
                  </div>
                  {errors.inputContactNumber && (
                    <WarningMessage text={errors.inputContactNumber?.message} />
                  )}
                </div>
                <div className="mt-4">
                  <div className="w-full">
                    <label
                      htmlFor="Address"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      Address
                    </label>
                    <textarea
                      className="w-full px-4 py-3 text-xs border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      cols={20}
                      rows={4}
                      placeholder="Address"
                      {...register("inputAddress", {
                        required: "Address is required",
                        onChange: (e: any) => setAddress(e.target.value),
                      })}
                      aria-invalid={errors.inputAddress ? "true" : "false"}
                    ></textarea>
                    {errors.inputAddress && (
                      <WarningMessage text={errors.inputAddress?.message} />
                    )}
                  </div>
                </div>
                <div className="space-x-0 lg:flex lg:space-x-4">
                  <div className="w-full lg:w-1/2">
                    <label
                      htmlFor="city"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      {...register("inputCity", {
                        required: "City is required",
                        onChange: (e: any) => setCity(e.target.value),
                      })}
                      aria-invalid={errors.inputCity ? "true" : "false"}
                    />
                  </div>
                  {errors.inputCity && (
                    <WarningMessage text={errors.inputCity?.message} />
                  )}
                  <div className="w-full lg:w-1/2 ">
                    <label
                      htmlFor="province"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      Province
                    </label>
                    <input
                      type="text"
                      placeholder="Province"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      {...register("inputProvince", {
                        required: "Province is required",
                        onChange: (e: any) => setProvince(e.target.value),
                      })}
                      aria-invalid={errors.inputProvince ? "true" : "false"}
                    />
                  </div>
                  {errors.inputProvince && (
                    <WarningMessage text={errors.inputProvince?.message} />
                  )}
                </div>
                <div className="space-x-0 lg:flex lg:space-x-4 mt-4">
                  <div className="w-full lg:w-1/2">
                    <label
                      htmlFor="deliveryMode"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      Delivery Mode
                    </label>
                    <RadioButton
                      name={"deliveryMode"}
                      id={"delivery"}
                      value={"delivery"}
                      handleInput={setDeliveryMode}
                      label={"Delivery"}
                      checkedFunction={
                        deliveryMode == "delivery" ? true : false
                      }
                    />
                    <RadioButton
                      name={"deliveryMode"}
                      id={"pickup"}
                      value={"pickup"}
                      handleInput={setDeliveryMode}
                      label={"Pick-up"}
                      checkedFunction={deliveryMode == "pickup" ? true : false}
                    />
                  </div>
                  {/* TODO: Google Map */}
                  {/* <div className="w-full lg:w-1/2 ">
                    <label
                      htmlFor="googleMap"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      Google Map
                    </label>
                  </div> */}
                </div>
                <div className="relative pt-3 xl:pt-6">
                  <label
                    htmlFor="note"
                    className="block mb-3 text-sm font-semibold text-gray-500"
                  >
                    {" "}
                    Notes (Optional)
                  </label>
                  <textarea
                    className="flex items-center w-full px-4 py-3 text-sm border bg-white text-black border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                    rows={4}
                    placeholder="Notes for delivery"
                    {...register("inputNotes", {
                      onChange: (e: any) => setNotes(e.target.value),
                    })}
                    aria-invalid={errors.inputNotes ? "true" : "false"}
                  ></textarea>
                  {errors.inputNotes && (
                    <WarningMessage text={errors.inputNotes?.message} />
                  )}
                </div>
                <div className="mt-4">
                  {deliveryMode == "pickup" ? (
                    <div>
                      <button
                        type="submit"
                        className="w-full px-6 py-2 text-blue-200 bg-blue-600 hover:bg-blue-900 disabled"
                      >
                        Process Payment
                      </button>
                      <button
                        className="w-full px-6 py-2 text-blue-200 bg-blue-600 hover:bg-blue-900 mt-2"
                        onClick={(e) => {
                          setPaymentMethod(
                            PaymentMethodEnum.PAYMENT_UPON_PICK_UP
                          );
                        }}
                      >
                        Payment Upon Pickup
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-full px-6 py-2 text-blue-200 bg-blue-600 hover:bg-blue-900 disabled"
                      type="submit"
                    >
                      Process Payment
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
          <div className="flex flex-col w-2/5   ml-12">
            <div className="pt-12 md:pt-0 2xl:ps-4">
              <h2 className="text-xl font-bold text-black">Order Summary</h2>
              <div className="mt-8">
                <div className="flex flex-col space-y-4">
                  {cartContents &&
                  cartContents.products &&
                  cartContents.products.length > 0 ? (
                    cartContents.products.map((e: any) => {
                      const imageLink = e.image.src ? e.image.src : e.image;
                      return (
                        <>
                          <div className="flex space-x-4">
                            <div>
                              <Image
                                src={imageLink}
                                alt="image"
                                className="w-60"
                                width="1024"
                                height="1024"
                              />
                            </div>
                            <div className="w-full">
                              <h2 className="text-xl font-bold text-black">
                                {e.name}
                              </h2>
                              <p className="text-sm">{e.description}</p>
                              <span className="text-black">Price</span>
                              <span className="ml-2">Php {e.price}</span>
                              <p></p>
                              <span className="text-black">Quantity</span>{" "}
                              <span className="ml-2">{e.quantity}</span>
                            </div>
                            <div>
                              <button
                                onClick={() => {
                                  handleRemoveFromCart(e);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-6 h-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <div className="flex space-x-4">
                      <div>
                        <h2 className="text-xl font-bold text-black">
                          No items in cart
                        </h2>
                      </div>
                    </div>
                  )}
                  {/* <div className="flex space-x-4">
                    <div>
                      <img
                        src="https://source.unsplash.com/user/erondu/1600x900"
                        alt="image"
                        className="w-60"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Title</h2>
                      <p className="text-sm">Lorem ipsum dolor sit amet, tet</p>
                      <span className="text-red-600">Price</span> $20
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div> */}
                  {/* <div className="flex space-x-4">
                    <div>
                      <img
                        src="https://source.unsplash.com/collection/190727/1600x900"
                        alt="image"
                        className="w-60"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Title</h2>
                      <p className="text-sm">Lorem ipsum dolor sit amet, tet</p>
                      <span className="text-red-600">Price</span> $20
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="flex p-4 mt-4">
                <h2 className="text-xl font-bold">
                  ITEMS:{" "}
                  {cartContents && cartContents.products
                    ? cartContents.products.length
                    : 0}
                </h2>
              </div>
              <div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
                Subtotal
                <span className="ml-2">
                  Php{" "}
                  {cartContents?.subtotal_price
                    ? cartContents?.subtotal_price
                    : 0}
                </span>
              </div>
              {/* <div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
                Shipping Tax<span className="ml-2">$10</span>
              </div> */}
              <div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
                Total
                <span className="ml-2">
                  Php{" "}
                  {cartContents?.subtotal_price
                    ? cartContents?.subtotal_price
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const cookies = nookies.get(context);

    if (cookies.token) {
      const token = await admin.auth().verifyIdToken(cookies.token);

      const { uid, email } = token;

      const getCartResult = await getCartViaIdFunction(uid);
      return {
        props: {
          user: uid,
          cart: getCartResult.isSuccess ? getCartResult.result : null,
          isError: false,
          errorMessage: "",
          redirect: "/",
        },
      };
    } else {
      if (cookies.cart) {
        return {
          props: {
            user: null,
            cart: JSON.parse(cookies.cart),
            isError: false,
            errorMessage: "",
            redirect: "/",
          },
        };
      } else {
        return {
          props: {
            user: null,
            cart: null,
            isError: false,
            errorMessage: "",
            redirect: "/",
          },
        };
      }
    }
  } catch (err) {
    return {
      props: {
        user: null,
        cart: null,
        isError: true,
        errorMessage: "Error with getting cart",
        redirect: "/login",
      },
    };
  }
}
