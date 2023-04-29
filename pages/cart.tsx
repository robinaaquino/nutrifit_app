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

export default function Cart(props: any) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [notes, setNotes] = useState("");

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

  const handleFormForPaymentUponPickup = async (e: any) => {
    if (cartContents != null && cartContents.products.length > 0) {
      const shipping_details = {
        address: address,
        first_name: firstName,
        last_name: lastName,
        city: city,
        province: province,
        contact_number: contactNumber,
      };

      const orderDetails: OrdersDatabaseType = {
        total_price: cartContents.subtotal_price,
        payment: {
          created_at: new Date().toString(),
          date_cleared: "",
          payment_method: PaymentMethodEnum.PAYMENT_UPON_PICK_UP,
          price_paid: 0,
          updated_at: new Date().toString(),
        },
        products: cartContents.products,
        status: OrderStatusEnum.PENDING,

        user_id: props.user ? props.user : "",
        note: notes,
        delivery_mode: "pickup",
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
              onSubmit={(e) => e.preventDefault()}
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
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      onChange={(e) => {
                        setFirstName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="w-full lg:w-1/2 ">
                    <label
                      htmlFor="firstName"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      Last Name
                    </label>
                    <input
                      name="Last Name"
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      onChange={(e) => {
                        setLastName(e.target.value);
                      }}
                    />
                  </div>
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
                      name="Last Name"
                      type="text"
                      placeholder="Contact number"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      onChange={(e) => {
                        setContactNumber(e.target.value);
                      }}
                    />
                  </div>
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
                      name="Address"
                      cols={20}
                      rows={4}
                      placeholder="Address"
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                    ></textarea>
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
                      name="city"
                      type="text"
                      placeholder="City"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                    />
                  </div>
                  <div className="w-full lg:w-1/2 ">
                    <label
                      htmlFor="province"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      Province
                    </label>
                    <input
                      name="province"
                      type="text"
                      placeholder="Province"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
                      onChange={(e) => {
                        setProvince(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="space-x-0 lg:flex lg:space-x-4 mt-4">
                  <div className="w-full lg:w-1/2">
                    <label
                      htmlFor="deliveryMode"
                      className="block mb-3 text-sm font-semibold text-gray-500"
                    >
                      Delivery Mode
                    </label>
                    <div>
                      <input
                        name="deliveryMode"
                        type="radio"
                        value="delivery"
                        className="m-2"
                        onChange={(e) => {
                          setDeliveryMode(e.target.value);
                        }}
                      />
                      <label htmlFor="deliveryMode" className="text-black">
                        Delivery
                      </label>
                      <input
                        name="deliveryMode"
                        type="radio"
                        value="pickup"
                        className="m-2"
                        onChange={(e) => {
                          setDeliveryMode(e.target.value);
                        }}
                      />
                      <label htmlFor="deliveryMode" className="text-black">
                        Pickup
                      </label>
                    </div>
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
                {/* <div className="flex items-center mt-4">
                  <label className="flex items-center text-sm group text-heading">
                    <input
                      type="checkbox"
                      className="w-5 h-5 border border-gray-300 rounded focus:outline-none focus:ring-1"
                    />
                    <span className="ml-2">
                      Save this information htmlFor next time
                    </span>
                  </label>
                </div> */}
                <div className="relative pt-3 xl:pt-6">
                  <label
                    htmlFor="note"
                    className="block mb-3 text-sm font-semibold text-gray-500"
                  >
                    {" "}
                    Notes (Optional)
                  </label>
                  <textarea
                    name="note"
                    className="flex items-center w-full px-4 py-3 text-sm border bg-white text-black border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                    rows={4}
                    placeholder="Notes for delivery"
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="mt-4">
                  {deliveryMode == "pickup" ? (
                    <div>
                      <button
                        className="w-full px-6 py-2 text-blue-200 bg-blue-600 hover:bg-blue-900 disabled"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Process Payment
                      </button>
                      <button
                        className="w-full px-6 py-2 text-blue-200 bg-blue-600 hover:bg-blue-900 mt-2"
                        onClick={(e) => {
                          handleFormForPaymentUponPickup(e);
                        }}
                      >
                        Payment Upon Pickup
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-full px-6 py-2 text-blue-200 bg-blue-600 hover:bg-blue-900 disabled"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
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
