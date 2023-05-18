import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuthContext } from "@/context/AuthContext";

import {
  CollectionsEnum,
  MessageStatusEnum,
} from "@/firebase/constants/enum_constants";
import { MessagesDatabaseType } from "@/firebase/constants/messages_constants";
import { FunctionResult } from "@/firebase/constants/function_constants";

import { updateMessageFunction } from "@/firebase/firebase_functions/messages_functions";
import { getDocumentGivenTypeAndIdFunction } from "@/firebase/firebase_functions/general_functions";

import HeadingTwo from "@/components/forms/HeadingTwo";

export default function ContactUs() {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
                      className="text-black bg-white border-[f0f0f0] focus:border-primary w-full rounded border py-3 px-[14px]  outline-none focus-visible:shadow-none"
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
                      className="text-black bg-white border-[f0f0f0] focus:border-primary w-full rounded border py-3 px-[14px]  outline-none focus-visible:shadow-none"
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
                      onChange={(e) => {
                        setStatus(
                          e.target.value == MessageStatusEnum.REPLIED
                            ? MessageStatusEnum.REPLIED
                            : MessageStatusEnum.UNREAD
                        );
                      }}
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
                      className="text-black bg-white border-[f0f0f0] focus:border-primary w-full resize-none rounded border py-3 px-[14px]  outline-none focus-visible:shadow-none"
                      disabled
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className=" w-1/2 cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
                      onClick={(e: any) => handleForm(e)}
                    >
                      Update message
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
