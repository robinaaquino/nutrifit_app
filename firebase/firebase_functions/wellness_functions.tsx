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
import { FunctionResult } from "../constants/function_constants";
import { WellnessDatabaseType } from "../constants/wellness_constants";
import {
  ResultTypeEnum,
  WellnessRemarksEnum,
} from "../constants/enum_constants";
import { SuccessCodes, ErrorCodes } from "../constants/success_and_error_codes";
import { parseError } from "../helpers";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

export const addWellnessSurveyResult = async (
  wellnessSurveyResult: WellnessDatabaseType
) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };
  let data: WellnessDatabaseType = {} as WellnessDatabaseType;

  try {
    data = {
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
      program: WellnessRemarksEnum.BLANK,
      meal_plan: "",
    };

    const documentRef = await addDoc(collection(db, "results"), data);

    data = {
      id: documentRef.id,
      ...data,
    };

    resultObject = {
      result: data,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: true,
      message: SuccessCodes["add-wellness-survey-result"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);
    console.log(e);
    resultObject = {
      result: data,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage
        ? errorMessage
        : ErrorCodes["add-wellness-survey-result"],
    };
  }

  return resultObject;
};

export const updateWellnessSurveyResultFunction = async (
  wellnessSurveyResult: WellnessDatabaseType,
  wellnessSurveyResultId: string
) => {
  let resultObject: FunctionResult = {
    result: null,
    resultType: ResultTypeEnum.NULL,
    isSuccess: false,
    message: "",
  };

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
        : WellnessRemarksEnum.BLANK,
      meal_plan: wellnessSurveyResult.meal_plan,
    };

    await setDoc(doc(db, "results", wellnessSurveyResultId), {
      updated_at: new Date().toString(),
      ...wellnessSurveyResultToBeAdded,
    });

    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: true,
      message: SuccessCodes["update-wellness-survey-result"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);
    console.log(e);
    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: false,
      message: errorMessage
        ? errorMessage
        : ErrorCodes["update-wellness-survey-result"],
    };
  }

  return resultObject;
};
