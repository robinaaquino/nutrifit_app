import { db, storage } from "../config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import * as Constants from "../constants";
import { FunctionResult } from "@/firebase/constants";
import { parseError } from "../helpers";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

export const getAllWellnessSurveyResultsFunction = async () => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const docs = await getDocs(collection(db, "results"));

    docs.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      datas.push({
        id,
        ...data,
      });
    });

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Successful in getting all wellness survey results",
      errorMessage: "",
    };
  } catch (e: unknown) {
    console.log(e);
    resultObject = {
      result: datas,
      isSuccess: false,
      resultText: "Failed in getting all wellness survey results",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getAllWellnessSurveyResultsViaIdFunction = async (
  userId: string
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const docs = await getDocs(collection(db, "results"));

    docs.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      if (data.user_id == userId) {
        datas.push({
          id,
          ...data,
        });
      }
    });

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Successful in getting all wellness survey results for user",
      errorMessage: "",
    };
  } catch (e: unknown) {
    console.log(e);
    resultObject = {
      result: datas,
      isSuccess: false,
      resultText: "Failed in getting all wellness survey results for user",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getAllWellnessSurveyResultsWithFilterFunction = async (
  filter: any
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];
  let resultQuery: any[] = [];

  try {
    if (filter.program != "") {
      resultQuery.push(where("program", "==", filter.program));
    }

    if (filter.reviewed_by_admin == true || filter.reviewed_by_admin == false) {
      resultQuery.push(
        where("reviewed_by_admin", "==", filter.reviewed_by_admin)
      );
    }

    console.log(resultQuery);

    const resultReference = query(collection(db, "results"), ...resultQuery);

    const docs = await getDocs(resultReference);
    docs.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      datas.push({
        id,
        ...data,
      });
    });

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText:
        "Successful in getting all wellness survey results with filter",
      errorMessage: "",
    };
  } catch (e: unknown) {
    console.log(e);
    resultObject = {
      result: datas,
      isSuccess: false,
      resultText: "Failed in getting all wellness survey results with filter",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getAllWellnessSurveyResultsWithSearchFunction = async (
  searchString: any
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const result = await getAllWellnessSurveyResultsFunction();

    if (!result.isSuccess) {
      resultObject = {
        result: datas,
        isSuccess: false,
        resultText:
          "Failed in getting all wellness survey results with search string",
        errorMessage: result.errorMessage,
      };
    }

    const results = result.result;

    const individualStrings = searchString.toLowerCase().split(" ");
    for (let i = 0; i < results.length; i++) {
      let matchedString = false;
      for (let j = 0; j < individualStrings.length; j++) {
        let regexExpression = `^.*` + individualStrings[j] + `.*$`;
        if (
          results[i].name.toLowerCase().match(regexExpression) ||
          results[i].contact_number.toLowerCase().match(regexExpression) ||
          results[i].reviewed_by_admin
            .toString()
            .toLowerCase()
            .match(regexExpression) ||
          results[i].program.toLowerCase().match(regexExpression) ||
          results[i].meal_plan.toLowerCase().match(regexExpression) ||
          results[i].gender.toLowerCase().match(regexExpression)
        ) {
          matchedString = true;
          break;
        }

        if (
          results[i].wellness_survey &&
          results[i].wellness_survey.length > 0
        ) {
          results[i].wellness_survey.map((element: any) => {
            if (element.toLowerCase().match(regexExpression)) {
              matchedString = true;
            }
          });

          if (matchedString) {
            break;
          }
        }
      }

      if (matchedString) {
        datas.push(results[i]);
      }
    }

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText:
        "Successful in getting all wellness survey results with search string",
      errorMessage: "",
    };
  } catch (e: unknown) {
    console.log(e);
    resultObject = {
      result: datas,
      isSuccess: false,
      resultText:
        "Failed in getting all wellness survey results with search string",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getWellnessSurveyResultsViaIdFunction = async (id: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const wellnessSurveyResultReference = doc(db, "results", id);

    const wellnessSurveyResultSnapshot = await getDoc(
      wellnessSurveyResultReference
    );

    if (wellnessSurveyResultSnapshot.exists()) {
      resultObject = {
        result: {
          id: wellnessSurveyResultSnapshot.id,
          ...wellnessSurveyResultSnapshot.data(),
        },
        isSuccess: true,
        resultText: "Successful in getting wellness survey result information",
        errorMessage: "",
      };
    } else {
      resultObject = {
        result: data,
        isSuccess: true,
        resultText: "Wellness survey result does not exist",
        errorMessage: "",
      };
    }
  } catch (e: unknown) {
    console.log(e);
    resultObject = {
      result: data,
      isSuccess: false,
      resultText: "Failed in getting wellness survey result information",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const addWellnessSurveyResult = async (
  wellnessSurveyResult: Constants.WellnessOverallResults
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const wellnessSurveyResultToBeAdded = {
      created_at: new Date().toString(),
      updated_at: new Date().toString(),

      user_id: wellnessSurveyResult.user_id ? wellnessSurveyResult.user_id : "",
      wellness_survey: wellnessSurveyResult.wellness_survey
        ? wellnessSurveyResult.wellness_survey
        : [],
      name: wellnessSurveyResult.name ? wellnessSurveyResult.name : "",
      contact_number: wellnessSurveyResult.contact_number
        ? wellnessSurveyResult.contact_number
        : "",
      gender: wellnessSurveyResult.gender ? wellnessSurveyResult.gender : "",
      height: wellnessSurveyResult.height ? wellnessSurveyResult.height : 0,
      age: wellnessSurveyResult.age ? wellnessSurveyResult.age : 0,
      weight: wellnessSurveyResult.weight ? wellnessSurveyResult.weight : 0,

      reviewed_by_admin: false,
      wellness_trainer_information:
        wellnessSurveyResult.wellness_trainer_information
          ? wellnessSurveyResult.wellness_trainer_information
          : {
              date: "",
              fat: "",
              visceral_fat: "",
              bone_mass: "",
              resting_metabolic_rate: "",
              metabolic_age: "",
              muscle_mass: "",
              physique_rating: "",
              water: "",
            },
      wellness_remarks: {
        present_weight: 0,
        ideal_weight: 0,
        weight_status: "",
        weight_status_number: 0,
        ideal_visceral: 0,
      },
      program: Constants.WellnessRemarks.BLANK,
      meal_plan: "",
    };

    const documentRef = await addDoc(
      collection(db, "results"),
      wellnessSurveyResultToBeAdded
    );

    const data = {
      id: documentRef.id,
      ...wellnessSurveyResultToBeAdded,
    };

    resultObject = {
      result: data,
      isSuccess: true,
      resultText:
        "Successful in submitting wellness survey. Please, wait for a message from our administrators.",
      errorMessage: "",
    };
  } catch (e: unknown) {
    console.log(e);
    resultObject = {
      result: "",
      isSuccess: false,
      resultText: "Failed in submitting wellness survey. Please, try again.",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const updateWellnessSurveyResultFunction = async (
  wellnessSurveyResult: Constants.WellnessOverallResults,
  wellnessSurveyResultId: string
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const wellnessSurveyResultToBeAdded = {
      created_at: wellnessSurveyResult.created_at
        ? wellnessSurveyResult.created_at
        : new Date().toString(),

      user_id: wellnessSurveyResult.user_id
        ? wellnessSurveyResult.user_id
        : null,
      wellness_survey: wellnessSurveyResult.wellness_survey
        ? wellnessSurveyResult.wellness_survey
        : [],
      name: wellnessSurveyResult.name ? wellnessSurveyResult.name : "",
      contact_number: wellnessSurveyResult.contact_number
        ? wellnessSurveyResult.contact_number
        : "",
      gender: wellnessSurveyResult.gender ? wellnessSurveyResult.gender : "",
      height: wellnessSurveyResult.height ? wellnessSurveyResult.height : 0,
      age: wellnessSurveyResult.age ? wellnessSurveyResult.age : 0,
      weight: wellnessSurveyResult.weight ? wellnessSurveyResult.weight : 0,

      reviewed_by_admin: true,
      wellness_trainer_information:
        wellnessSurveyResult.wellness_trainer_information
          ? wellnessSurveyResult.wellness_trainer_information
          : {
              date: "",
              fat: "",
              visceral_fat: "",
              bone_mass: "",
              resting_metabolic_rate: "",
              metabolic_age: "",
              muscle_mass: "",
              physique_rating: "",
              water: "",
            },
      wellness_remarks: wellnessSurveyResult.wellness_remarks
        ? wellnessSurveyResult.wellness_remarks
        : {
            present_weight: 0,
            ideal_weight: 0,
            weight_status: "",
            weight_status_number: 0,
            ideal_visceral: 0,
          },
      program: wellnessSurveyResult.program
        ? wellnessSurveyResult.program
        : Constants.WellnessRemarks.BLANK,
      meal_plan: wellnessSurveyResult.meal_plan,
    };

    await setDoc(doc(db, "results", wellnessSurveyResultId), {
      updated_at: new Date().toString(),
      ...wellnessSurveyResultToBeAdded,
    });

    resultObject = {
      result: wellnessSurveyResultId,
      isSuccess: true,
      resultText: "Successful in updating wellness survey result",
      errorMessage: "",
    };
  } catch (e: unknown) {
    console.log(e);
    resultObject = {
      result: "",
      isSuccess: false,
      resultText: "Failed in updating wellness survey result",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const deleteWellnessSurveyResult = async (resultId: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  try {
    await deleteDoc(doc(db, "results", resultId));

    resultObject = {
      result: {},
      isSuccess: true,
      resultText: "Successful in deleting wellness survey result",
      errorMessage: "",
    };
  } catch (e: unknown) {
    console.log(e);
    resultObject = {
      result: {},
      isSuccess: false,
      resultText: "Failed in deleting wellness survey result",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};
