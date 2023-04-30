import { db, storage } from "../config";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  query,
  where,
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

export const getAllUsersFunction = async () => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const docs = await getDocs(collection(db, "users"));

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
      resultText: "Successful in getting all users",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in getting all users",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const addUserFunction = async (user: Constants.UsersDatabaseType) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const documentRef = await setDoc(doc(db, "users", user.id), {
      email: user.email,
      id: user.id,
      contact_number: "",
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
      shipping_details: {
        address: "",
        first_name: "",
        last_name: "",
        municipality: "",
        province: "",
      },
      role: Constants.ROLE_STATES.CUSTOMER,
    });

    resultObject = {
      result: user.id,
      isSuccess: true,
      resultText: "Successful in adding customer",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: "",
      isSuccess: true,
      resultText: "Failed in adding customer",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getUserFunction = async (id: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    const userReference = doc(db, "users", id);

    const userSnapshot = await getDoc(userReference);

    if (userSnapshot.exists()) {
      resultObject = {
        result: { id: userSnapshot.id, ...userSnapshot.data() },
        isSuccess: true,
        resultText: "Successful in getting user information",
        errorMessage: "",
      };
    } else {
      resultObject = {
        result: data,
        isSuccess: true,
        resultText: "User does not exist",
        errorMessage: "",
      };
    }
  } catch (e: unknown) {
    resultObject = {
      result: data,
      isSuccess: true,
      resultText: "Failed in getting user information",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const updateUserFunction = async (
  user: Constants.UsersDatabaseType,
  userId: string
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  try {
    let userToBeAdded: Constants.UsersDatabaseType = {
      id: userId,
      updated_at: new Date().toString(),
      created_at: user.created_at,
      email: user.email,
      role: user.role,
      shipping_details: user.shipping_details,
      image: user.image ? user.image : "",
    };

    const storageRef = ref(storage, `/users/${userId}`);
    if (user.image && user.image instanceof File && user.image.name) {
      await uploadBytes(storageRef, user.image, {
        contentType: user.image["type"],
      }).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((url: any) => {
          userToBeAdded.image = url;
        });
      });
    }

    await setDoc(doc(db, "users", userId), userToBeAdded);

    resultObject = {
      result: userToBeAdded,
      isSuccess: true,
      resultText: "Successful in updating user",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: {},
      isSuccess: false,
      resultText: "Failed in updating user",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const isUserAuthorizedFunction = async (id: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  try {
    const userReference = doc(db, "users", id);

    const userSnapshot = await getDoc(userReference);

    if (userSnapshot.exists()) {
      resultObject = {
        result: userSnapshot.data().role == "admin" ? true : false,
        isSuccess: true,
        resultText: "Successful in getting user authorization status",
        errorMessage: "",
      };
    } else {
      resultObject = {
        result: false,
        isSuccess: true,
        resultText: "User does not exist",
        errorMessage: "",
      };
    }
  } catch (e: unknown) {
    resultObject = {
      result: false,
      isSuccess: true,
      resultText: "Failed in getting user information",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getAllUsersWithFilterFunction = async (filter: any) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];
  let userQuery: any[] = [];

  try {
    if (filter.role) {
      userQuery.push(where("role", "==", filter.role));
    }

    const userReference = query(collection(db, "users"), ...userQuery);

    const docs = await getDocs(userReference);
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
      resultText: "Successful in getting all users with filter",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in getting all users with filter",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getAllUsersWithSearchFunction = async (searchString: any) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const result = await getAllUsersFunction();

    if (!result.isSuccess) {
      resultObject = {
        result: datas,
        isSuccess: false,
        resultText: "Failed in getting all users with search string",
        errorMessage: result.errorMessage,
      };
    }

    const users = result.result;

    const individualStrings = searchString.toLowerCase().split(" ");
    for (let i = 0; i < users.length; i++) {
      let matchedString = false;
      for (let j = 0; j < individualStrings.length; j++) {
        let regexExpression = `^.*` + individualStrings[j] + `.*$`;
        if (
          users[i].email.toLowerCase().match(regexExpression) ||
          users[i].shipping_details?.first_name
            .toString()
            .match(regexExpression) ||
          users[i].shipping_details?.last_name
            .toString()
            .match(regexExpression) ||
          users[i].shipping_details?.address
            .toString()
            .match(regexExpression) ||
          users[i].shipping_details?.province
            .toString()
            .match(regexExpression) ||
          users[i].shipping_details?.city.toString().match(regexExpression) ||
          users[i].role.toLowerCase().match(regexExpression)
        ) {
          matchedString = true;
          break;
        }
      }
      if (matchedString) {
        datas.push(users[i]);
      }
    }

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Successful in getting all users with search string",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in getting all users with search string",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const deleteUserFunction = async (userId: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };

  try {
    await deleteDoc(doc(db, "users", userId));

    resultObject = {
      result: {},
      isSuccess: true,
      resultText: "Successful in deleting user",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: {},
      isSuccess: false,
      resultText: "Failed in deleting user",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};
