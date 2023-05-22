import { useState, useEffect } from "react";
import nookies from "nookies";
import { useRouter } from "next/router";

import admin from "@/firebase/admin-config";
import { useAuthContext } from "@/context/AuthContext";

import {
  CollectionsEnum,
  MessageStatusEnum,
} from "@/firebase/constants/enum_constants";
import { MessagesDatabaseType } from "@/firebase/constants/messages_constants";
import { isUserAuthorizedFunction } from "@/firebase/firebase_functions/users_functions";
import { FunctionResult } from "@/firebase/constants/function_constants";

import { updateMessageFunction } from "@/firebase/firebase_functions/messages_functions";
import { getDocumentGivenTypeAndIdFunction } from "@/firebase/firebase_functions/general_functions";

import HeadingTwo from "@/components/forms/HeadingTwo";

export default function MessageEdit(props: any) {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState<MessageStatusEnum>(
    MessageStatusEnum.UNREAD
  );
  const [createdAt, setCreatedAt] = useState("");
  const { success, error } = useAuthContext();

  async function fetchMessage() {
    var idInput = "";
    if (id) {
      if (id[0]) {
        idInput = id.toString();
      } else if (typeof id == "string") {
        idInput = id;
      }
    }

    const result: FunctionResult = await getDocumentGivenTypeAndIdFunction(
      CollectionsEnum.MESSAGE,
      idInput
    );

    const messageResult: MessagesDatabaseType =
      result.result as MessagesDatabaseType;

    if (!result.isSuccess) {
      error(result.message);
      router.push("/");
    } else {
      setName(messageResult.name);
      setMessage(messageResult.message);
      setEmail(messageResult.email);
      setStatus(messageResult.status);
      setReply(messageResult.reply || "");
      setCreatedAt(messageResult.created_at || "");
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

    const previousMessage: MessagesDatabaseType = {
      name: name,
      email: email,
      message: message,
      status: status,
      reply: reply,
      updated_at: new Date().toString(),
      created_at: createdAt,
    };

    const result = await updateMessageFunction(previousMessage, idInput);

    if (result.isSuccess) {
      success(result.message);
      router.push("/admin/message");
    } else {
      error(result.message);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  if (props.isError) {
    error(props.message);
    router.push(props.redirect);
    return null;
  }

  return (
    <>
      <section className="relative z-10 overflow-hidden bg-white py-20 lg:py-[120px]">
        <div className="container mx-auto">
          <HeadingTwo label={"Message Details"} />
          <div className="pt-4 -mx-4 flex flex-wrap lg:justify-between">
            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="relative rounded-lg bg-white p-8 shadow-lg sm:p-12">
                <form>
                  <div className="mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Type your name..."
                      className="text-gray-500 bg-white border-[f0f0f0] focus:border-primary w-full rounded border py-3 px-[14px]  outline-none focus-visible:shadow-none"
                      disabled
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Type your email address..."
                      className="text-gray-500 bg-white border-[f0f0f0] focus:border-primary w-full rounded border py-3 px-[14px]  outline-none focus-visible:shadow-none"
                      disabled
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      id="status"
                      className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      disabled
                      value={status}
                    >
                      <option value={"unread"} key={"unread"}>
                        Unread
                      </option>
                      <option value={"replied"} key={"replied"}>
                        Replied
                      </option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Message
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Type your message..."
                      className="text-gray-500 bg-white border-[f0f0f0] focus:border-primary w-full resize-none rounded border py-3 px-[14px]  outline-none focus-visible:shadow-none"
                      disabled
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-reply"
                    >
                      Reply
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Type your message..."
                      className={`${
                        status == MessageStatusEnum.REPLIED
                          ? "text-gray-500"
                          : "text-black"
                      }  bg-white border-[f0f0f0] focus:border-primary w-full resize-none rounded border py-3 px-[14px]  outline-none focus-visible:shadow-none`}
                      disabled={
                        status == MessageStatusEnum.REPLIED ? true : false
                      }
                      onChange={(e) => {
                        setReply(e.target.value);
                      }}
                      value={reply}
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className={`w-1/2 cursor-pointer rounded-md border  py-3 px-5 text-white bg-nf_green ${
                        status == MessageStatusEnum.REPLIED ? "opacity-50" : ""
                      } transition hover:bg-nf_dark_green`}
                      onClick={(e: any) => handleForm(e)}
                      disabled={
                        status == MessageStatusEnum.REPLIED ? true : false
                      }
                    >
                      Send reply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
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
