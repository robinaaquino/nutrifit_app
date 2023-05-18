import nookies from "nookies";
import admin from "@/firebase/admin-config";

import Filter from "@/components/filter/Filter";
import SearchBar from "@/components/universal/SearchBar";
import TableComponent from "@/components/admin/TableComponent";

import { isUserAuthorizedFunction } from "@/firebase/firebase_functions/users_functions";
import { CollectionsEnum } from "@/firebase/constants/enum_constants";
import { getAllDocumentsGivenTypeFunction } from "@/firebase/firebase_functions/general_functions";
import {
  applyFilterFunction,
  applySearchFunction,
} from "@/firebase/firebase_functions/filter_and_search_functions";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MessagesDatabaseType } from "@/firebase/constants/messages_constants";

export default function AdminMessage(props: any) {
  const [messages, setMessages] = useState<MessagesDatabaseType[]>([]);
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
    const result = await getAllDocumentsGivenTypeFunction(
      CollectionsEnum.MESSAGE
    );
    const messageResult: MessagesDatabaseType[] =
      result.result as MessagesDatabaseType[];

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setMessages(messageResult);
    }
  }

  async function handleSearch(searchString: any) {
    const result = await applySearchFunction(
      CollectionsEnum.MESSAGE,
      searchString
    );
    if (!result.isSuccess) {
      error(result.message);
    } else {
      setMessages(result.result);
    }
  }

  async function handleFilters(filter: any) {
    const result = await applyFilterFunction(CollectionsEnum.MESSAGE, filter);

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setMessages(result.result);
    }
  }

  useEffect(() => {
    fetchAllMessages();
  }, []);

  if (props.isError) {
    error(props.message);
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

    const isAdmin = await isUserAuthorizedFunction(uid);

    if (!isAdmin) {
      return {
        props: {
          isError: true,
          message: "Unauthorized access",
          redirect: "/",
        },
      };
    }

    return {
      props: {
        authorized: isAdmin,
        isError: false,
        message: "",
        redirect: "",
      },
    };
  } catch (err) {
    return {
      props: {
        isError: true,
        message: "Unauthenticated access",
        redirect: "/login",
      },
    };
  }
}
