import nookies from "nookies";
import admin from "@/firebase/admin-config";

import Filter from "@/components/filter/Filter";
import SearchBar from "@/components/universal/SearchBar";
import TableComponent from "@/components/admin/TableComponent";

import { UsersDatabaseType } from "@/firebase/constants";
import { getUserFunction } from "@/firebase/firebase_functions/users_functions";
import {
  getAllMessagesFunction,
  getAllMessagesWithFilterFunction,
  getAllMessagesWithSearchFunction,
} from "@/firebase/firebase_functions/messages_functions";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminMessage(props: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const { error } = useAuthContext();
  const router = useRouter();

  const tableHeaders: string[] = [
    "ID",
    "Name",
    "Email",
    "Status",
    "Message",
    "Created at",
    "Updated at",
  ];

  const tableContentKeys: string[] = [
    "id",
    "name",
    "email",
    "status",
    "message",
    "created_at",
    "updated_at",
  ];

  async function fetchAllMessages() {
    const result = await getAllMessagesFunction();

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setMessages(result.result);
    }
  }

  async function handleSearch(searchString: any) {
    const result = await getAllMessagesWithSearchFunction(searchString);
    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setMessages(result.result);
    }
  }

  async function handleFilters(filter: any) {
    const result = await getAllMessagesWithFilterFunction(filter);
    console.log(result);
    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setMessages(result.result);
    }
  }

  useEffect(() => {
    fetchAllMessages();
  }, []);

  if (props.isError) {
    error(props.errorMessage);
    router.push(props.redirect);
    return null;
  }

  return (
    <>
      <div className="container px-4 mx-auto min-h-screen">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-x-3">
              <h2 className="text-lg font-medium text-black ">Messages</h2>

              <span className="px-3 py-1 text-xs text-white bg-nf_green rounded-full">
                {messages.length}{" "}
                {messages.length == 1 ? "message" : "messages"}
              </span>
            </div>
          </div>

          <div className="flex items-center mt-4 gap-x-3">
            <SearchBar handleSearch={handleSearch} />
            <Filter
              handleFilters={handleFilters}
              resetFilter={fetchAllMessages}
              isMessageFilter={true}
            />
          </div>
        </div>

        <TableComponent
          headers={tableHeaders}
          contentKeys={tableContentKeys}
          content={messages}
          type="message"
          isAdmin={true}
        />
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const cookies = nookies.get(context);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    const isAdminResult = await getUserFunction(uid);
    const isAdmin = isAdminResult.result.role == "admin" ? true : false;

    if (!isAdmin) {
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
    return {
      props: {
        isError: true,
        errorMessage: "Unauthenticated access",
        redirect: "/login",
      },
    };
  }
}
