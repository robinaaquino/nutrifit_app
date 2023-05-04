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
} from "firebase/firestore";
import * as Constants from "../constants";
import { FunctionResult } from "@/firebase/constants";
import {
  parseError,
  getImageInProduct,
  computeSubtotalInCart,
} from "../helpers";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

export const initializeNewCartFunction = async (
  userId: string,
  product?: any,
  quantity?: number
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  try {
    if (product) {
      const productToBeAddedToCart = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        quantity: quantity,
        image: getImageInProduct(product),
      };

      let newCart: any = {
        created_at: new Date().toString(),
        products: [productToBeAddedToCart],
        subtotal_price: productToBeAddedToCart.price * (quantity || 0),
        updated_at: new Date().toString(),
        user_id: userId,
      };

      const cartReference = doc(db, "carts", userId);

      await setDoc(cartReference, newCart);

      resultObject = {
        result: newCart,
        isSuccess: true,
        resultText: "Successful in initializing cart with product",
        errorMessage: "",
      };
    } else {
      let newCart: any = {
        created_at: new Date().toString(),
        products: [],
        subtotal_price: 0,
        updated_at: new Date().toString(),
        user_id: userId,
      };

      const cartReference = doc(db, "carts", userId);

      await setDoc(cartReference, newCart);

      resultObject = {
        result: newCart,
        isSuccess: true,
        resultText: "Successful in initializing cart",
        errorMessage: "",
      };
    }
  } catch (e: unknown) {
    resultObject = {
      result: {},
      isSuccess: false,
      resultText: "Failed in initializing cart",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const addToCartFunction = async (
  product: Constants.ProductsDatabaseType,
  quantity: number,
  userId: string
) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: any = {};
  const productToBeAddedToCart = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    quantity: quantity,
    image: getImageInProduct(product),
  };

  try {
    const cartReference = doc(db, "carts", userId);

    const cartSnapshot = await getDoc(cartReference);

    if (!cartSnapshot.exists()) {
      const initializationResult = await initializeNewCartFunction(
        userId,
        product,
        quantity
      );

      if (initializationResult.isSuccess) {
        resultObject = {
          result: initializationResult.result,
          isSuccess: true,
          resultText: "Successful in adding product to cart",
          errorMessage: "",
        };
      } else {
        resultObject = {
          result: initializationResult.result,
          isSuccess: false,
          resultText: "Failed in adding product to cart",
          errorMessage: initializationResult.errorMessage,
        };
      }
    } else {
      //get docs
      var cartData = cartSnapshot.data();

      //check if product exists in cart already
      let productAlreadyInCart = false;
      for (let i = 0; i < cartData.products.length; i++) {
        if (cartData.products[i].id == productToBeAddedToCart.id) {
          productAlreadyInCart = true;
          break;
        }
      }

      if (productAlreadyInCart) {
        resultObject = {
          result: cartData,
          isSuccess: false,
          resultText: "Failed in adding product to cart",
          errorMessage: "Duplicate product",
        };
      } else {
        cartData.products.push(productToBeAddedToCart);
        cartData.subtotal_price += productToBeAddedToCart.price * quantity;

        await setDoc(cartReference, cartData, { merge: true });

        resultObject = {
          result: cartData,
          isSuccess: true,
          resultText: "Successful in adding product to cart",
          errorMessage: "",
        };
      }
    }
  } catch (e: unknown) {
    resultObject = {
      result: data,
      isSuccess: false,
      resultText: "Failed in getting cart information",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const removeFromCartFunction = async (product: any, userId: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: any = {};

  try {
    const cartReference = doc(db, "carts", userId);

    const cartSnapshot = await getDoc(cartReference);

    if (!cartSnapshot.exists()) {
      resultObject = {
        result: userId,
        isSuccess: false,
        resultText: "Failed in removing product from cart",
        errorMessage: "Cart does not exist",
      };
    }

    var cartData: any = cartSnapshot.data();
    let productFound = false;
    for (let i = 0; i < cartData?.products.length; i++) {
      if (cartData?.products[i].id == product.id) {
        cartData.updated_at = new Date().toString();
        cartData.subtotal_price =
          cartData.subtotal_price - product.quantity * product.price;
        cartData.products.splice(i, 1);
        productFound = true;
        break;
      }
    }

    if (productFound) {
      await setDoc(cartReference, cartData);

      resultObject = {
        result: userId,
        isSuccess: true,
        resultText: "Successful in initializing cart with product",
        errorMessage: "",
      };
    } else {
      resultObject = {
        result: data,
        isSuccess: false,
        resultText: "Failed in removing product from cart",
        errorMessage: "Product does not exist in cart",
      };
    }
  } catch (e: unknown) {
    resultObject = {
      result: data,
      isSuccess: false,
      resultText: "Failed in removing product from cart",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const clearCartFunction = async (userId: string) => {
  //reset products
  //subtotal price = 0
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: any = {}; //change to orders database type

  try {
    const cartReference = doc(db, "carts", userId);

    const cartSnapshot = await getDoc(cartReference);

    if (cartSnapshot.exists()) {
      data = cartSnapshot.data();

      data.products = [];
      data.subtotal_price = 0;
      data.updated_at = new Date().toString();

      await setDoc(cartReference, data);

      resultObject = {
        result: data,
        isSuccess: true,
        resultText: "Successful in resetting cart information",
        errorMessage: "",
      };
    } else {
      resultObject = {
        result: data,
        isSuccess: false,
        resultText: "Failed in getting cart information and resetting cart",
        errorMessage: "User has no cart",
      };
    }
  } catch (e: unknown) {
    resultObject = {
      result: data,
      isSuccess: false,
      resultText: "Failed in resetting cart information",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};

export const getCartViaIdFunction = async (userId: string) => {
  let resultObject: FunctionResult = {
    result: "",
    isSuccess: false,
    resultText: "",
    errorMessage: "",
  };
  let data: any = {};

  try {
    const cartReference = doc(db, "carts", userId);

    const cartSnapshot = await getDoc(cartReference);

    if (cartSnapshot.exists()) {
      data = cartSnapshot.data();

      resultObject = {
        result: data,
        isSuccess: true,
        resultText: "Successful in getting cart information",
        errorMessage: "",
      };
    } else {
      const initializationResult = await initializeNewCartFunction(userId);

      if (initializationResult.isSuccess) {
        resultObject = {
          result: initializationResult.result,
          isSuccess: true,
          resultText:
            "Successful in getting cart information and initializing new cart",
          errorMessage: "",
        };
      } else {
        resultObject = {
          result: data,
          isSuccess: false,
          resultText:
            "Failed in getting cart information and initializing new cart",
          errorMessage: initializationResult.errorMessage,
        };
      }
    }
  } catch (e: unknown) {
    resultObject = {
      result: data,
      isSuccess: false,
      resultText: "Failed in getting cart information",
      errorMessage: parseError(e),
    };
  }

  return resultObject;
};
