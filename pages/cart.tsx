import { useAuthContext } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import nookies from "nookies";
import admin from "../firebase/admin-config";
import Link from "next/link";
import Image from "next/image";

import { auth } from "@/firebase/firebase_functions/auth_functions";

import { OrdersDatabaseType } from "@/firebase/constants/orders_constants";
import {
  PaymentMethodEnum,
  OrderStatusEnum,
} from "@/firebase/constants/enum_constants";
import {
  getCartViaIdFunction,
  clearCartFunction,
} from "@/firebase/firebase_functions/cart_functions";

import { addOrderFunction } from "@/firebase/firebase_functions/orders_functions";
import { useRouter } from "next/navigation";
import RadioButton from "@/components/forms/RadioButton";

import { useForm } from "react-hook-form";
import InputComponent from "@/components/forms/input/InputComponent";
import InputSubmit from "@/components/forms/input/InputSubmit";
import Label from "@/components/forms/Label";

import HeadingTwo from "@/components/forms/HeadingTwo";

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
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const {
    deleteCartInCookiesAndContext,
    cart,
    removeFromCart,
    error,
    success,
    user,
    clear,
  } = useAuthContext();
  const router = useRouter();

  async function fetchCarts() {
    if (props.cart) {
      //if cart exists in cookies
      setCartContents(props.cart);
      setCartProducts(props.cart.products);
    }
  }

  function handleRemoveFromCart(product: any) {
    var previousCart = cartContents;
    for (let i = 0; i < previousCart.products.length; i++) {
      if (product.id == previousCart.products[i].id) {
        previousCart.products.splice(i, 1);
      }
    }
    previousCart.products = previousCart.products.slice();
    previousCart.subtotal_price =
      previousCart.subtotal_price - product.price * product.quantity;
    previousCart.updated_at = new Date().toString();
    removeFromCart(product);

    setCartContents(previousCart);
    setCartProducts(previousCart.products);
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
        address: deliveryMode == "delivery" ? inputAddress : "",
        first_name: inputFirstName,
        last_name: inputLastName,
        city: deliveryMode == "delivery" ? inputCity : "",
        province: deliveryMode == "delivery" ? inputProvince : "",
        contact_number: inputContactNumber,
      };

      const orderDetails: OrdersDatabaseType = {
        total_price:
          inputDeliveryMode == "delivery"
            ? cartContents.subtotal_price + 200
            : cartContents.subtotal_price,
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

      await auth.currentUser?.reload();
      const emailVerified = auth.currentUser?.emailVerified;

      if (!emailVerified && props.user) {
        error("Verify your email before checkout");
      } else {
        const result = await addOrderFunction(orderDetails);
        const resultOrder: OrdersDatabaseType =
          result.result as OrdersDatabaseType;

        if (result.isSuccess) {
          success(result.message);
          router.push(`/order/${resultOrder.id}`);
          nookies.set(undefined, "order", JSON.stringify(result.result));

          if (props.user || user) {
            const clearCartResult = await clearCartFunction(props.user || user);

            if (clearCartResult.isSuccess) {
              deleteCartInCookiesAndContext();
            } else {
              error(result.message);
            }
          } else {
            deleteCartInCookiesAndContext();
          }
        } else {
          error(result.message);
        }
      }
    } else {
      error("No items in cart");
    }
    e.preventDefault();
  };

  function handlePaymentUponPickup() {
    setPaymentMethod(PaymentMethodEnum.PAYMENT_UPON_PICK_UP);
  }

  function handleCashlessPayment() {
    setPaymentMethod(PaymentMethodEnum.GCASH);
  }

  useEffect(() => {
    clear();
    fetchCarts();
  }, []);

  return (
    <>
      <div className="container p-12 mx-auto">
        <div className="flex flex-col w-full px-0 mx-auto md:flex-row">
          <div className="flex flex-col w-2/5">
            <form
              className="justify-center w-full mx-auto"
              onSubmit={handleSubmit(handleFormForPayment)}
            >
              <div className="bg-gray-50 rounded-lg p-2 mb-2">
                <HeadingTwo label={"Contact Details"} />
                {/* First Name and Last Name */}
                <div className="grid grid-cols-2">
                  <InputComponent
                    id={"firstName"}
                    name={"inputFirstName"}
                    label={"First Name"}
                    type={"text"}
                    placeholder={"Type your first name..."}
                    value={firstName}
                    register={register}
                    rules={{
                      required: "First name is required",
                      onChange: (e: any) => setFirstName(e.target.value),
                    }}
                    error={errors}
                    aria-invalid={errors.inputFirstName ? "true" : "false"}
                  />
                  {/* <div className="w-full lg:w-1/2">
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
                  )} */}
                  <InputComponent
                    id={"lastName"}
                    name={"inputLastName"}
                    label={"Last Name"}
                    type={"text"}
                    placeholder={"Type your last name..."}
                    value={lastName}
                    register={register}
                    rules={{
                      required: "Last name is required",
                      onChange: (e: any) => setLastName(e.target.value),
                    }}
                    error={errors}
                    aria-invalid={errors.inputLastName ? "true" : "false"}
                  />
                  {/* <div className="w-full lg:w-1/2 ">
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
                  )} */}
                </div>
                {/* Contact Number */}
                <div className="">
                  <InputComponent
                    id={"contactNumber"}
                    name={"inputContactNumber"}
                    label={"Contact Number"}
                    type={"text"}
                    placeholder={"Type your contact number..."}
                    value={contactNumber}
                    register={register}
                    rules={{
                      required: "Contact number is required",
                      onChange: (e: any) => setContactNumber(e.target.value),
                    }}
                    error={errors}
                    aria-invalid={errors.inputContactNumber ? "true" : "false"}
                  />
                  {/* <div className="w-full">
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
                  )} */}
                </div>
              </div>

              {/* Shipping Address */}
              {deliveryMode == "delivery" ? (
                <div className="bg-gray-50 rounded-lg p-2">
                  <HeadingTwo label={"Shipping Address"} />
                  {/* Address */}
                  <div className="mt-4">
                    <InputComponent
                      id={"address"}
                      name={"inputAddress"}
                      label={"Address"}
                      type={"text"}
                      placeholder={"Type your address..."}
                      value={address}
                      register={register}
                      rules={{
                        required: "Address is required",
                        onChange: (e: any) => setAddress(e.target.value),
                      }}
                      error={errors}
                      aria-invalid={errors.inputAddress ? "true" : "false"}
                    />
                    {/* <div className="w-full">
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
                  </div> */}
                  </div>
                  {/* City  and Province*/}
                  <div className="grid grid-cols-2">
                    <InputComponent
                      id={"city"}
                      name={"inputCity"}
                      label={"City"}
                      type={"text"}
                      placeholder={"Type your city..."}
                      value={city}
                      register={register}
                      rules={{
                        required: "City is required",
                        onChange: (e: any) => setCity(e.target.value),
                      }}
                      error={errors}
                      aria-invalid={errors.inputCity ? "true" : "false"}
                    />
                    {/* <div className="w-full lg:w-1/2">
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
                  )} */}
                    <InputComponent
                      id={"province"}
                      name={"inputProvince"}
                      label={"Province"}
                      type={"text"}
                      placeholder={"Type your province..."}
                      value={province}
                      register={register}
                      rules={{
                        required: "Province is required",
                        onChange: (e: any) => setProvince(e.target.value),
                      }}
                      error={errors}
                      aria-invalid={errors.inputProvince ? "true" : "false"}
                    />
                    {/* <div className="w-full lg:w-1/2 ">
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
                  )} */}
                  </div>
                </div>
              ) : null}

              <div>
                <div className="space-x-0 lg:flex lg:space-x-4 mt-4">
                  <div className="w-full lg:w-1/2 px-3">
                    <Label label={"Delivery Mode"} id="deliveryMode" />
                    <RadioButton
                      name={"inputDeliveryMode"}
                      id={"delivery"}
                      register={register}
                      value={"delivery"}
                      handleInput={setDeliveryMode}
                      label={"Delivery"}
                      checkedFunction={
                        deliveryMode == "delivery" ? true : false
                      }
                    />
                    <RadioButton
                      name={"inputDeliveryMode"}
                      id={"pickup"}
                      value={"pickup"}
                      register={register}
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
                  <InputComponent
                    id={"notes"}
                    name={"inputNotes"}
                    label={"Notes (optional)"}
                    type={"text"}
                    placeholder={"Type your notes..."}
                    value={notes}
                    register={register}
                    rules={{
                      onChange: (e: any) => setNotes(e.target.value),
                    }}
                    error={errors}
                    aria-invalid={errors.inputNotes ? "true" : "false"}
                  />
                  {/* <label
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
                  )} */}
                </div>
                <div className="mt-4">
                  {deliveryMode == "pickup" ? (
                    <>
                      <InputSubmit
                        label={"Process Payment"}
                        handleClick={handleCashlessPayment}
                      />
                      {/* <button
                        type="submit"
                        className="w-full px-6 py-2 text-blue-200 bg-blue-600 hover:bg-blue-900 disabled"
                      >
                        Process Payment
                      </button> */}
                      <InputSubmit
                        label={"Payment upon Pickup"}
                        handleClick={handlePaymentUponPickup}
                      />
                    </>
                  ) : (
                    <InputSubmit
                      label={"Process Payment"}
                      handleClick={handleCashlessPayment}
                    />
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
                  {cartProducts && cartProducts.length > 0 ? (
                    cartProducts.map((e: any) => {
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
                              <h2 className="text-xl font-bold text-black hover:text-blue-800 hover:underline">
                                <Link href={`/product/${e.id}`}>{e.name}</Link>
                              </h2>
                              {/* <p className="text-sm">{e.description}</p> */}
                              <span className=" font-bold">Price</span>
                              <span className="ml-2 text-black font-bold">
                                Php {e.price}
                              </span>
                              <p></p>
                              <span className=" font-bold">Quantity</span>{" "}
                              <span className="ml-2 text-black font-bold">
                                {e.quantity}
                              </span>
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
                <h2 className="text-xl font-bold ">
                  ITEMS:{" "}
                  <span className="text-black">
                    {cartContents && cartContents.products
                      ? cartContents.products.length
                      : 0}
                  </span>
                </h2>
              </div>
              {deliveryMode == "delivery" ? (
                <>
                  <div className="flex items-center w-full py-4 text-sm font-semibold px-3 text-heading last:border-b-0 last:text-base last:pb-0">
                    Subtotal
                    <span className="ml-2 text-black">
                      Php{" "}
                      {cartContents?.subtotal_price
                        ? cartContents?.subtotal_price
                        : 0}
                    </span>
                  </div>
                  <div className="flex items-center w-full text-sm font-semibold border-b px-3 pb-3 border-gray-300 text-heading ">
                    Shipping Price
                    <span className="ml-2 text-black">Php 200</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center w-full py-4 text-sm font-semibold lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0 border-b border-gray-300">
                  Subtotal
                  <span className="ml-2 text-black">
                    Php{" "}
                    {cartContents?.subtotal_price
                      ? cartContents?.subtotal_price
                      : 0}
                  </span>
                </div>
              )}

              {/* <div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
                Shipping Tax<span className="ml-2">$10</span>
              </div> */}
              <div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
                Total
                <span className="ml-2 text-black">
                  Php{" "}
                  {deliveryMode == "pickup"
                    ? cartContents?.subtotal_price
                      ? cartContents?.subtotal_price
                      : 0
                    : cartContents?.subtotal_price
                    ? cartContents?.subtotal_price + 200
                    : 200}
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
          message: "",
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
            message: "",
            redirect: "/",
          },
        };
      } else {
        return {
          props: {
            user: null,
            cart: null,
            isError: false,
            message: "",
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
        message: "Error with getting cart",
        redirect: "/login",
      },
    };
  }
}
