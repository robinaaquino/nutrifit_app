import { db, storage } from "../config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import * as Constants from "../constants";
import { FunctionResult } from "@/firebase/constants";
import { parseError } from "../helpers";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export const getAllProductsFunction = async () => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const docs = await getDocs(collection(db, "products"));

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
      resultText: "Successful in getting all products",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in getting all products",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const addProductFunction = async (
  product: Constants.ProductsDatabaseType
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: string = "";

  try {
    let productToBeAdded: Constants.ProductsDatabaseType = {
      quantity_in_carts: 0,
      quantity_sold: 0,
      updated_at: new Date().toString(),
      created_at: new Date().toString(),
      ...product,
      images: [],
    };

    const productId = v4();
    let promises: any[] = [];

    for (let i = 0; i < product.images.length; i++) {
      const storageRef = ref(storage, `/products/${productId}/${i}`);
      const upload = await uploadBytes(storageRef, product.images[0]).then(
        async (snapshot) => {
          await getDownloadURL(snapshot.ref).then((url: any) => {
            productToBeAdded.images.push(url);
          });
        }
      );
      promises.push(upload);
    }

    await Promise.all(promises).then(async (e) => {
      await setDoc(doc(db, "products", productId), productToBeAdded);
    });

    resultObject = {
      result: productId,
      isSuccess: true,
      resultText: "Successful in adding product",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: "",
      isSuccess: true,
      resultText: "Failed in adding product",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

//Ensure that to update a product, unchanged info is passed as well to prevent changes
export const updateProductFunction = async (
  product: Constants.ProductsDatabaseType,
  id: string
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const productReference = doc(db, "products", id);

    await updateDoc(productReference, {
      ...product,
      updated_at: new Date().toString(),
    });

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Successful in updating product",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in updating product",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const deleteProductFunction = async (id: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let datas: any[] = [];

  try {
    const productReference = doc(db, "products", id);

    await deleteDoc(productReference);

    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Successful in deleting product",
      errorMessage: "",
    };
  } catch (e: unknown) {
    resultObject = {
      result: datas,
      isSuccess: true,
      resultText: "Failed in deleting product",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};
