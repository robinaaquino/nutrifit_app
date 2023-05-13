import nookies from "nookies";
import admin from "@/firebase/admin-config";

import Filter from "@/components/universal/filter";
import SearchBar from "@/components/universal/search_bar";
import TableComponent from "@/components/admin/TableComponent";

import {
  getAllUsersFunction,
  getAllUsersWithFilterFunction,
  getAllUsersWithSearchFunction,
} from "@/firebase/firebase_functions/users_functions";
import { UsersDatabaseType } from "@/firebase/constants";
import { getUserFunction } from "@/firebase/firebase_functions/users_functions";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    const result = await getAllUsersFunction();

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setUsers(result.result);
    }
  }

  async function handleSearch(searchString: any) {
    const result = await getAllUsersWithSearchFunction(searchString);
    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setUsers(result.result);
    }
  }

  async function handleFilters(filter: any) {
    const result = await getAllUsersWithFilterFunction(filter);
    console.log(result);
    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setUsers(result.result);
    }
  }

  useEffect(() => {
    fetchAllUsers();
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
