import nookies from "nookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import admin from "@/firebase/admin-config";
import { useAuthContext } from "@/context/AuthContext";

import { UsersDatabaseType } from "@/firebase/constants/user_constants";
import { CollectionsEnum } from "@/firebase/constants/enum_constants";

import { isUserAuthorizedFunction } from "@/firebase/firebase_functions/users_functions";
import { getAllDocumentsGivenTypeFunction } from "@/firebase/firebase_functions/general_functions";
import {
  applyFilterFunction,
  applySearchFunction,
} from "@/firebase/firebase_functions/filter_and_search_functions";

import Filter from "@/components/filter/Filter";
import SearchBar from "@/components/universal/SearchBar";
import TableComponent from "@/components/admin/TableComponent";

export default function AdminOrder(props: any) {
  const [users, setUsers] = useState<UsersDatabaseType[]>([]);
  const { error } = useAuthContext();
  const router = useRouter();

  const tableHeaders: string[] = [
    "ID",
    "Email",
    "First name",
    "Last name",
    "Role",
    "Created at",
    "Updated at",
  ];

  const tableContentKeys: string[] = [
    "id",
    "email",
    "first_name",
    "last_name",
    "role",
    "created_at",
    "updated_at",
  ];

  async function fetchAllUsers() {
    const result = await getAllDocumentsGivenTypeFunction(CollectionsEnum.USER);
    const userResult: UsersDatabaseType[] =
      result.result as UsersDatabaseType[];

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setUsers(userResult);
    }
  }

  async function handleSearch(searchString: any) {
    const result = await applySearchFunction(
      CollectionsEnum.USER,
      searchString
    );
    if (!result.isSuccess) {
      error(result.message);
    } else {
      setUsers(result.result);
    }
  }

  async function handleFilters(filter: any) {
    const result = await applyFilterFunction(CollectionsEnum.USER, filter);

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setUsers(result.result);
    }
  }

  useEffect(() => {
    fetchAllUsers();
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
              <h2 className="text-lg font-medium text-black ">Users</h2>

              <span className="px-3 py-1 text-xs text-white bg-nf_green rounded-full">
                {users.length} {users.length == 1 ? "user" : "users"}
              </span>
            </div>
          </div>

          <div className="flex items-center mt-4 gap-x-3">
            <SearchBar handleSearch={handleSearch} />
            <Filter
              handleFilters={handleFilters}
              resetFilter={fetchAllUsers}
              isCustomerFilter={true}
            />
          </div>
        </div>

        <TableComponent
          headers={tableHeaders}
          contentKeys={tableContentKeys}
          content={users}
          type="user"
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

    //call is authorized idrreclt
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
