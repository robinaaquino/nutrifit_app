import nookies from "nookies";
import admin from "@/firebase/admin-config";

import Filter from "@/components/filter/Filter";
import SearchBar from "@/components/universal/SearchBar";
import TableComponent from "@/components/admin/TableComponent";

import { getAllDocumentsGivenTypeFunction } from "@/firebase/firebase_functions/general_functions";
import {
  applyFilterFunction,
  applySearchFunction,
} from "@/firebase/firebase_functions/filter_and_search_functions";
import { WellnessDatabaseType } from "@/firebase/constants/wellness_constants";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CollectionsEnum } from "@/firebase/constants/enum_constants";
import { isUserAuthorizedFunction } from "@/firebase/firebase_functions/users_functions";

export default function AdminWellness(props: any) {
  const [wellnessSurveyResults, setWellnessSurveyResults] = useState<
    WellnessDatabaseType[]
  >([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const result = await getAllDocumentsGivenTypeFunction(
      CollectionsEnum.WELLNESS
    );

    const resultObject: WellnessDatabaseType[] =
      result.result as WellnessDatabaseType[];

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setWellnessSurveyResults(resultObject);
    }
    setLoading(false);
  }

  async function handleSearch(searchString: any) {
    const result = await applySearchFunction(
      CollectionsEnum.WELLNESS,
      searchString
    );

    const resultObject: WellnessDatabaseType[] =
      result.result as WellnessDatabaseType[];

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setWellnessSurveyResults(resultObject);
    }
  }

  async function handleFilters(filter: any) {
    const result = await applyFilterFunction(CollectionsEnum.WELLNESS, filter);

    const resultObject: WellnessDatabaseType[] =
      result.result as WellnessDatabaseType[];

    if (!result.isSuccess) {
      error(result.message);
    } else {
      setWellnessSurveyResults(resultObject);
    }
  }

  useEffect(() => {
    fetchAllWellnessSurveyResults();
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
          type="wellness"
          isAdmin={true}
          loading={loading}
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
