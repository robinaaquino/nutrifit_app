import { db, storage } from "../config";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { FunctionResult } from "../constants/function_constants";
import { ResultTypeEnum, CollectionsEnum } from "../constants/enum_constants";
import { UsersDatabaseType } from "../constants/user_constants";
import { ErrorCodes, SuccessCodes } from "../constants/success_and_error_codes";
import {
  getAllDocumentsGivenTypeFunction,
  getDocumentGivenTypeAndIdFunction,
} from "./general_functions";

import { parseError } from "../helpers";

// Get all items with applied filter
export const applyFilterFunction = async (
  type: CollectionsEnum,
  filter: any
) => {
  let resultObject: FunctionResult = {
    result: [],
    resultType: ResultTypeEnum.ARRAY,
    isSuccess: false,
    message: "",
  };
  let datas: any[] = [];
  let queryList: any[] = [];

  try {
    if (type == CollectionsEnum.USER) {
      if (filter.role) {
        queryList.push(where("role", "==", filter.role));
      }

      const userReference = query(collection(db, "users"), ...queryList);

      const docs = await getDocs(userReference);
      docs.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        datas.push({
          id: id,
          email: data.email,
          ...data,
        });
      });
    } else if (type == CollectionsEnum.PRODUCT) {
      if (filter.category != "") {
        queryList.push(where("category", "==", filter.category));
      }

      if (filter.minPrice != 0) {
        queryList.push(where("price", ">=", filter.minPrice));
      }

      if (filter.maxPrice != 0) {
        queryList.push(where("price", "<=", filter.maxPrice));
      }

      const productReference = query(
        collection(db, "resultingArray"),
        ...queryList
      );

      const docs = await getDocs(productReference);
      docs.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        if (filter.inStock == true || filter.inStock == false) {
          if (filter.inStock) {
            if (data.quantity_left > 0) {
              datas.push({
                id,
                ...data,
              });
            }
          } else {
            if (data.quantity_left <= 0) {
              datas.push({
                id,
                ...data,
              });
            }
          }
        }
      });
    } else if (type == CollectionsEnum.MESSAGE) {
      if (filter.status) {
        queryList.push(where("status", "==", filter.status));
      }

      const messageReference = query(collection(db, "messages"), ...queryList);

      const docs = await getDocs(messageReference);
      docs.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        datas.push({
          id,
          ...data,
        });
      });
    } else if (type == CollectionsEnum.ORDER) {
      if (filter.status) {
        queryList.push(where("status", "==", filter.status));
      }

      if (filter.deliveryMode) {
        queryList.push(where("delivery_mode", "==", filter.deliveryMode));
      }

      if (filter.minPrice != 0) {
        queryList.push(where("total_price", ">=", filter.minPrice));
      }

      if (filter.maxPrice != 0) {
        queryList.push(where("total_price", "<=", filter.maxPrice));
      }

      const orderReference = query(
        collection(db, "resultingArray"),
        ...queryList
      );

      const docs = await getDocs(orderReference);
      docs.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        datas.push({
          id,
          ...data,
        });
      });

      for (let i = 0; i < datas.length; i++) {
        let currentData = datas[i];
        if (currentData.user_id) {
          const userDataResult = await getDocumentGivenTypeAndIdFunction(
            CollectionsEnum.ORDER,
            currentData.user_id
          );
          const userInformation: UsersDatabaseType =
            userDataResult.result as UsersDatabaseType;
          if (userDataResult.isSuccess) {
            currentData["email"] = userInformation.email;
          }
        } else {
          currentData["email"] = "Guest";
        }

        if (currentData.shipping_details) {
          currentData["first_name"] = currentData.shipping_details.first_name;
          currentData["last_name"] = currentData.shipping_details.last_name;
        }
      }
    } else if (type == CollectionsEnum.WELLNESS) {
      if (filter.program != "") {
        queryList.push(where("program", "==", filter.program));
      }

      if (
        filter.reviewed_by_admin == true ||
        filter.reviewed_by_admin == false
      ) {
        queryList.push(
          where("reviewed_by_admin", "==", filter.reviewed_by_admin)
        );
      }

      console.log(queryList);

      const resultReference = query(
        collection(db, "resultingArray"),
        ...queryList
      );

      const docs = await getDocs(resultReference);
      docs.forEach((doc) => {
        const id = doc.id;
        const data = doc.data();
        datas.push({
          id,
          ...data,
        });
      });
    }

    resultObject = {
      result: datas,
      resultType: ResultTypeEnum.ARRAY,

      isSuccess: true,
      message: SuccessCodes["apply-filters"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);
    resultObject = {
      result: datas,
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["apply-filters"],
    };
  }

  return resultObject;
};

// Get all items with the search string
export const applySearchFunction = async (
  type: CollectionsEnum,
  searchString: any
) => {
  let resultObject: FunctionResult = {
    result: [],
    resultType: ResultTypeEnum.ARRAY,
    isSuccess: false,
    message: "",
  };
  let datas: any[] = [];

  try {
    const result = await getAllDocumentsGivenTypeFunction(type);
    if (!result.isSuccess) {
      resultObject = {
        result: datas,
        resultType: ResultTypeEnum.ARRAY,
        isSuccess: false,
        message: ErrorCodes["apply-search"],
      };
    }
    const resultingArray: any[] = result.result as any[];

    if (type == CollectionsEnum.USER) {
      const individualStrings = searchString.toLowerCase().split(" ");
      for (let i = 0; i < resultingArray.length; i++) {
        let matchedString = false;
        for (let j = 0; j < individualStrings.length; j++) {
          let regexExpression = `^.*` + individualStrings[j] + `.*$`;
          if (
            resultingArray[i].email.toLowerCase().match(regexExpression) ||
            (resultingArray[i].shipping_details?.first_name &&
              resultingArray[i].shipping_details?.first_name
                .toString()
                .match(regexExpression)) ||
            (resultingArray[i].shipping_details?.last_name &&
              resultingArray[i].shipping_details?.last_name
                .toString()
                .match(regexExpression)) ||
            (resultingArray[i].shipping_details?.address &&
              resultingArray[i].shipping_details?.address
                .toString()
                .match(regexExpression)) ||
            (resultingArray[i].shipping_details?.province &&
              resultingArray[i].shipping_details?.province
                .toString()
                .match(regexExpression)) ||
            (resultingArray[i].shipping_details?.city &&
              resultingArray[i].shipping_details?.city
                .toString()
                .match(regexExpression)) ||
            resultingArray[i].role.toLowerCase().match(regexExpression)
          ) {
            matchedString = true;
            break;
          }
        }

        if (matchedString) {
          datas.push(resultingArray[i]);
        }
      }
    } else if (type == CollectionsEnum.PRODUCT) {
      const individualStrings = searchString.toLowerCase().split(" ");
      for (let i = 0; i < resultingArray.length; i++) {
        let matchedString = false;
        for (let j = 0; j < individualStrings.length; j++) {
          let regexExpression = `^.*` + individualStrings[j] + `.*$`;
          if (
            resultingArray[i].name.toLowerCase().match(regexExpression) ||
            resultingArray[i].description
              .toLowerCase()
              .match(regexExpression) ||
            resultingArray[i].category.toLowerCase().match(regexExpression)
          ) {
            matchedString = true;
            break;
          }
        }
        if (matchedString) {
          datas.push(resultingArray[i]);
        }
      }
    } else if (type == CollectionsEnum.MESSAGE) {
      const individualStrings = searchString.toLowerCase().split(" ");
      for (let i = 0; i < resultingArray.length; i++) {
        let matchedString = false;
        for (let j = 0; j < individualStrings.length; j++) {
          let regexExpression = `^.*` + individualStrings[j] + `.*$`;
          if (
            resultingArray[i].name.toLowerCase().match(regexExpression) ||
            resultingArray[i].email.toLowerCase().match(regexExpression) ||
            resultingArray[i].status.toLowerCase().match(regexExpression) ||
            resultingArray[i].message.toLowerCase().match(regexExpression)
          ) {
            matchedString = true;
            break;
          }
        }
        if (matchedString) {
          datas.push(resultingArray[i]);
        }
      }
    } else if (type == CollectionsEnum.ORDER) {
      for (let i = 0; i < resultingArray.length; i++) {
        let currentData = resultingArray[i];
        if (currentData.user_id) {
          const userDataResult = await getDocumentGivenTypeAndIdFunction(
            CollectionsEnum.ORDER,
            currentData.user_id
          );

          const userInformation: UsersDatabaseType =
            userDataResult.result as UsersDatabaseType;
          if (userDataResult.isSuccess) {
            currentData["email"] = userInformation.email;
          }
        } else {
          currentData["email"] = "Guest";
        }

        if (currentData.shipping_details) {
          currentData["first_name"] = currentData.shipping_details.first_name;
          currentData["last_name"] = currentData.shipping_details.last_name;
        }
      }
      console.log("resultingArray", resultingArray);

      const individualStrings = searchString.toLowerCase().split(" ");
      for (let i = 0; i < resultingArray.length; i++) {
        let matchedString = false;
        for (let j = 0; j < individualStrings.length; j++) {
          let regexExpression = `^.*` + individualStrings[j] + `.*$`;
          if (
            resultingArray[i].email.toLowerCase().match(regexExpression) ||
            resultingArray[i].total_price.toString().match(regexExpression) ||
            resultingArray[i].delivery_mode
              .toLowerCase()
              .match(regexExpression) ||
            resultingArray[i].status.toLowerCase().match(regexExpression) ||
            resultingArray[i].id.toLowerCase().match(regexExpression)
          ) {
            matchedString = true;
            break;
          } else if (
            (resultingArray[i].shipping_details &&
              resultingArray[i].shipping_details.first_name
                .toLowerCase()
                .match(regexExpression)) ||
            resultingArray[i].shipping_details.last_name
              .toLowerCase()
              .match(regexExpression)
          ) {
            matchedString = true;
            break;
          }
        }
        if (matchedString) {
          datas.push(resultingArray[i]);
        }
      }
    } else if (type == CollectionsEnum.WELLNESS) {
      const individualStrings = searchString.toLowerCase().split(" ");
      for (let i = 0; i < resultingArray.length; i++) {
        let matchedString = false;
        for (let j = 0; j < individualStrings.length; j++) {
          let regexExpression = `^.*` + individualStrings[j] + `.*$`;
          if (
            resultingArray[i].name.toLowerCase().match(regexExpression) ||
            resultingArray[i].contact_number
              .toLowerCase()
              .match(regexExpression) ||
            resultingArray[i].reviewed_by_admin
              .toString()
              .toLowerCase()
              .match(regexExpression) ||
            resultingArray[i].program.toLowerCase().match(regexExpression) ||
            resultingArray[i].meal_plan.toLowerCase().match(regexExpression) ||
            resultingArray[i].gender.toLowerCase().match(regexExpression)
          ) {
            matchedString = true;
            break;
          }

          if (
            resultingArray[i].wellness_survey &&
            resultingArray[i].wellness_survey.length > 0
          ) {
            resultingArray[i].wellness_survey.map((element: any) => {
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
          datas.push(resultingArray[i]);
        }
      }
    }

    resultObject = {
      result: datas,
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: true,
      message: SuccessCodes["apply-search"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);
    console.log(e);
    resultObject = {
      result: datas,
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["apply-search"],
    };
  }

  return resultObject;
};
