import { db, storage } from "../config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { ResultTypeEnum } from "../constants/enum_constants";
import { ProductsDatabaseType } from "../constants/product_constants";
import { FunctionResult } from "../constants/function_constants";
import { parseError } from "../helpers";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { ErrorCodes, SuccessCodes } from "../constants/success_and_error_codes";

export const addProductFunction = async (product: ProductsDatabaseType) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };
  let data: ProductsDatabaseType = {} as ProductsDatabaseType;

  try {
    data = {
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
      const upload = await uploadBytes(storageRef, product.images[i], {
        contentType: product.images[i]["type"],
      }).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((url: any) => {
          data.images.push(url);
        });
      });
      promises.push(upload);
    }

    await Promise.all(promises).then(async (e) => {
      await setDoc(doc(db, "products", productId), data);
    });

    resultObject = {
      result: data,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: true,
      message: SuccessCodes["add-product"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);
    resultObject = {
      result: data,
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["add-product"],
    };
  }

  return resultObject;
};

//Ensure that to update a product, unchanged info is passed as well to prevent changes
export const updateProductFunction = async (
  product: ProductsDatabaseType,
  productId: string
) => {
  let resultObject: FunctionResult = {
    result: null,
    resultType: ResultTypeEnum.NULL,
    isSuccess: false,
    message: "",
  };
  let datas: ProductsDatabaseType[] = [];

  try {
    let productToBeAdded: ProductsDatabaseType = {
      quantity_in_carts: product.quantity_in_carts,
      quantity_sold: product.quantity_sold,
      updated_at: new Date().toString(),
      created_at: product.created_at,
      category: product.category,
      description: product.description,
      price: product.price,
      quantity_left: product.quantity_left,
      name: product.name,
      images: product.images,
    };
    let promises: any[] = [];

    for (let i = 0; i < 4; i++) {
      if (product.images[i]) {
        if (product.images[i].name) {
          const storageRef = ref(storage, `/products/${productId}/${i}`);

          const upload = await uploadBytes(storageRef, product.images[i], {
            contentType: product.images[i]["type"],
          }).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then((url: any) => {
              productToBeAdded.images[i] = url;
            });
          });
          promises.push(upload);
        } else {
          productToBeAdded.images[i] = product.images[i];
        }
      }
    }

    await Promise.all(promises).then(async (e) => {
      await setDoc(doc(db, "products", productId), productToBeAdded);
    });

    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: true,
      message: SuccessCodes["update-product"],
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["update-product"],
    };
  }

  return resultObject;
};

export const deleteProductFunction = async (product: ProductsDatabaseType) => {
  let resultObject: FunctionResult = {
    result: null,
    resultType: ResultTypeEnum.NULL,
    isSuccess: false,
    message: "",
  };

  try {
    const productId = product.id || "";
    const productReference = doc(db, "products", productId);

    let promises: any[] = [];

    if (product.images) {
      for (let i = 0; i < 4; i++) {
        if (product.images[i]) {
          if (product.images[i].name) {
            const storageRef = ref(storage, `/products/${productId}/${i}`);

            const deletion = await deleteObject(storageRef);
            promises.push(deletion);
          }
        }
      }
    }

    await Promise.all(promises).then(async (e) => {
      await deleteDoc(productReference);
    });

    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: true,
      message: SuccessCodes.delete,
    };
  } catch (e: unknown) {
    const errorMessage = parseError(e);
    console.log(e);
    resultObject = {
      result: null,
      resultType: ResultTypeEnum.NULL,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes.delete,
    };
  }

  return resultObject;
};

export const getBestSellingProducts = async () => {
  let resultObject: FunctionResult = {
    result: [],
    resultType: ResultTypeEnum.ARRAY,
    isSuccess: false,
    message: "",
  };
  let datas: ProductsDatabaseType[] = [];

  try {
    const productReference = query(
      collection(db, "products"),
      orderBy("quantity_sold", "desc")
    );

    const docs = await getDocs(productReference);

    docs.forEach((doc) => {
      const id = doc.id;
      const data = doc.data();
      datas.push({
        id,
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        quantity_left: data.quantity_left,
        images: data.images,
        ...data,
      });
    });

    resultObject = {
      result: datas,
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: true,
      message: SuccessCodes["best-selling-products"],
    };
  } catch (e: unknown) {
    console.log(e);

    resultObject = {
      result: [],
      resultType: ResultTypeEnum.ARRAY,
      isSuccess: false,
      message: ErrorCodes["best-selling-products"],
    };
  }

  return resultObject;
};
