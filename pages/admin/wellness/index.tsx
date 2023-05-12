import nookies from "nookies";
import admin from "@/firebase/admin-config";

import Filter from "@/components/universal/filter";
import SearchBar from "@/components/universal/search_bar";
import TableComponent from "@/components/admin/TableComponent";

import {
  getAllWellnessSurveyResultsFunction,
  getAllWellnessSurveyResultsWithFilterFunction,
  getAllWellnessSurveyResultsWithSearchFunction,
} from "@/firebase/firebase_functions/wellness_function";
import { WellnessOverallResults } from "@/firebase/constants";
import { getUserFunction } from "@/firebase/firebase_functions/users_function";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminWellness(props: any) {
  const [wellnessSurveyResults, setWellnessSurveyResults] = useState<
    WellnessOverallResults[]
  >([]);
  const { error } = useAuthContext();
  const router = useRouter();

  const tableHeaders: string[] = [
    "ID",
    "Name",
    "Contact Number",
    "Reviewed by Admin",
    "Program",
    "Height",
    "Weight",
    "Age",
    "Date submitted",
  ];

  const tableContentKeys: string[] = [
    "id",
    "name",
    "contact_number",
    "reviewed_by_admin",
    "program",
    "height",
    "weight",
    "age",
    "date",
  ];

  async function fetchAllWellnessSurveyResults() {
    const result = await getAllWellnessSurveyResultsFunction();
    console.log(result);

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setWellnessSurveyResults(result.result);
    }
  }

  async function handleSearch(searchString: any) {
    const result = await getAllWellnessSurveyResultsWithSearchFunction(
      searchString
    );
    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setWellnessSurveyResults(result.result);
    }
  }

  async function handleFilters(filter: any) {
    const result = await getAllWellnessSurveyResultsWithFilterFunction(filter);
    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      setWellnessSurveyResults(result.result);
    }
  }

  useEffect(() => {
    fetchAllWellnessSurveyResults();
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
              <h2 className="text-lg font-medium text-black ">
                Wellness Survey Results
              </h2>

              <span className="px-3 py-1 text-xs text-white bg-nf_green rounded-full">
                {wellnessSurveyResults.length}{" "}
                {wellnessSurveyResults.length == 1
                  ? "wellness survey result"
                  : "wellness survey results"}
              </span>
            </div>
          </div>

          <div className="flex items-center mt-4 gap-x-3">
            <SearchBar handleSearch={handleSearch} />
            <Filter
              handleFilters={handleFilters}
              resetFilter={fetchAllWellnessSurveyResults}
              isWellnessFilter={true}
            />
          </div>
        </div>

        <TableComponent
          headers={tableHeaders}
          contentKeys={tableContentKeys}
          content={wellnessSurveyResults}
          type="order"
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
