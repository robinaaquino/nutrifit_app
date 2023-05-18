import { useRouter } from "next/router";
import nookies from "nookies";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

import admin from "@/firebase/admin-config";
import { useAuthContext } from "@/context/AuthContext";

import { OrdersDatabaseType } from "@/firebase/constants/orders_constants";
import {
  OrderStatusEnum,
  PaymentMethodEnum,
  CollectionsEnum,
} from "@/firebase/constants/enum_constants";
import { getDocumentGivenTypeAndIdFunction } from "@/firebase/firebase_functions/general_functions";
import { isUserAuthorizedFunction } from "@/firebase/firebase_functions/users_functions";
import { updateOrderFunction } from "@/firebase/firebase_functions/orders_functions";

import RadioButton from "@/components/forms/RadioButton";

export default function OrderShow(props: any) {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<OrdersDatabaseType>({
    id: "",
    created_at: "",
    updated_at: "",

    total_price: 0,
    date_cleared: "",

    payment: {
      created_at: "",
      date_cleared: "",
      payment_method: PaymentMethodEnum.BLANK,
      price_paid: 0,
      updated_at: "",
    },
    products: [],
    status: OrderStatusEnum.PENDING,
    user_id: "",
    note: "",
    delivery_mode: "",
    shipping_details: {
      address: "",
      first_name: "",
      last_name: "",
      city: "",
      province: "",
      contact_number: "",
    },
  });
  const [status, setStatus] = useState<OrderStatusEnum>(
    OrderStatusEnum.PENDING
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      inputDeliveryMode: "pickup",
    },
  });

  const { error, user, success } = useAuthContext();

  async function fetchOrder() {
    var idInput = "";
    if (id) {
      if (id[0]) {
        idInput = id.toString();
      } else if (typeof id == "string") {
        idInput = id;
      }
    }

    const result = await getDocumentGivenTypeAndIdFunction(
      CollectionsEnum.ORDER,
      idInput
    );

    const orderObject: OrdersDatabaseType = result.result as OrdersDatabaseType;

    if (!result.isSuccess) {
      error(result.message);
      router.push("/");
    } else {
      setOrder(orderObject);
      setStatus(orderObject.status);
    }
  }

  const handleForm = async (e: any) => {
    e.preventDefault();
    var idInput = "";
    if (id) {
      if (id[0]) {
        idInput = id.toString();
      } else if (typeof id == "string") {
        idInput = id;
      }
    }

    const previousOrder: OrdersDatabaseType = order;
    previousOrder.status = status;

    const result = await updateOrderFunction(previousOrder, idInput);

    if (result.isSuccess) {
      success(result.message);
      router.push("/admin/order");
    } else {
      error(result.message);
    }
  };

  useEffect(() => {
    fetchOrder();
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
              onSubmit={(e) => {
                e.preventDefault();
              }}
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
                      value={order.shipping_details.first_name}
                      disabled
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
                      value={order.shipping_details.last_name}
                      disabled
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
                      value={order.shipping_details.contact_number}
                      disabled
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
                      value={order.shipping_details.address}
                      disabled
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
                      value={order.shipping_details.city}
                      disabled
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
                      value={order.shipping_details.province}
                      disabled
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
                    <RadioButton
                      name={"inputDeliveryMode"}
                      id={"delivery"}
                      register={register}
                      value={"delivery"}
                      label={"Delivery"}
                      checkedFunction={
                        order.delivery_mode == "delivery" ? true : false
                      }
                      disabled
                    />
                    <RadioButton
                      name={"inputDeliveryMode"}
                      id={"pickup"}
                      register={register}
                      value={"pickup"}
                      label={"Pick-up"}
                      checkedFunction={
                        order.delivery_mode == "pickup" ? true : false
                      }
                      disabled
                    />
                  </div>
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
                    name="note"
                    className="flex items-center w-full px-4 py-3 text-sm border bg-white text-black border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                    rows={4}
                    placeholder="Notes for delivery"
                    value={order.note}
                    disabled
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
          <div className="flex flex-col w-2/5 ml-12">
            <div className="pt-12 h-full">
              <h2 className="text-xl font-bold text-black">Order Summary</h2>
              <div className="mt-8">
                <div className="flex flex-col space-y-4">
                  {order && order.products && order.products.length > 0 ? (
                    order.products.map((e: any, index) => {
                      const imageLink = e.image.src ? e.image.src : e.image;
                      return (
                        <>
                          <div className="flex space-x-4" key={index}>
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
                </div>
              </div>
              <div className="flex p-4 mt-4">
                <h2 className="text-xl font-bold">
                  ITEMS: {order && order.products ? order.products.length : 0}
                </h2>
              </div>
              <div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
                Subtotal
                <span className="ml-2">
                  Php {order?.total_price ? order?.total_price : 0}
                </span>
              </div>
              <div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
                Total
                <span className="ml-2">
                  Php {order?.total_price ? order?.total_price : 0}
                </span>
              </div>

              <div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading text-black last:border-b-0 last:text-base last:pb-0">
                Order Status
                <select
                  name="status"
                  id="status"
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  onChange={(e) => {
                    setStatus(
                      OrderStatusEnum[
                        e.target.value.toUpperCase() as keyof typeof OrderStatusEnum
                      ]
                    );
                  }}
                  value={status}
                >
                  <option value={"pending"} key={OrderStatusEnum.PENDING}>
                    Pending
                  </option>
                  <option value={"delivered"} key={OrderStatusEnum.DELIVERED}>
                    Delivered
                  </option>
                  <option value={"cancelled"} key={OrderStatusEnum.CANCELLED}>
                    Cancelled
                  </option>
                </select>
              </div>
              <div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading text-black last:border-b-0 last:text-base last:pb-0">
                Order ID
                <span className="ml-2 text-gray-500">{order.id}</span>
              </div>
            </div>
            <button
              className=" w-full cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
              onClick={(e) => handleForm(e)}
            >
              Edit Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  var props: any = {
    authorized: false,
    user: null,
    order: null,
    isError: false,
    message: "",
    redirect: "/",
  };
  try {
    const cookies = nookies.get(context);
    if (cookies.order) {
      const order = JSON.parse(cookies.order);

      props.order = order;
    }

    if (cookies.token) {
      const token = await admin.auth().verifyIdToken(cookies.token);
      const { uid } = token;

      props.user = uid;

      const isAdmin = await isUserAuthorizedFunction(uid);

      props.authorized = isAdmin;
    }

    return { props };
  } catch (err) {
    return {
      props: {
        authorized: false,
        user: null,
        order: null,
        isError: true,
        message: "Error with getting order",
        redirect: "/",
      },
    };
  }
}
