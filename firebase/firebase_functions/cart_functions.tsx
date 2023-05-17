import { db } from "../config";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { FunctionResult } from "../constants/function_constants";
import { ResultTypeEnum } from "../constants/enum_constants";

import {
  ProductsInCartsType,
  CartsDatabaseType,
} from "../constants/cart_constants";
import { ProductsDatabaseType } from "../constants/product_constants";
import { SuccessCodes, ErrorCodes } from "../constants/success_and_error_codes";
import { parseError, getImageInProduct } from "../helpers";

// Initialize a new cart for new user
export const initializeNewCartFunction = async (
  userId: string,
  product?: ProductsDatabaseType,
  quantity?: number
) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };

  try {
    if (product) {
      const productToBeAddedToCart: ProductsInCartsType = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        quantity: quantity ? quantity : 1,
        image: getImageInProduct(product),
      };

      let newCart: CartsDatabaseType = {
        created_at: new Date().toString(),
        updated_at: new Date().toString(),

        products: [productToBeAddedToCart],
        subtotal_price: productToBeAddedToCart.price * (quantity || 1),
        user_id: userId,
      };

      const cartReference = doc(db, "carts", userId);

      await setDoc(cartReference, newCart);

      resultObject = {
        result: newCart,
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: true,
        message: SuccessCodes["initialize-cart-with-product"],
      };
    } else {
      let newCart: CartsDatabaseType = {
        created_at: new Date().toString(),
        updated_at: new Date().toString(),

        products: [],
        subtotal_price: 0,
        user_id: userId,
      };

      const cartReference = doc(db, "carts", userId);

      await setDoc(cartReference, newCart);

      resultObject = {
        result: newCart,
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: true,
        message: SuccessCodes["initialize-cart"],
      };
    }
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: {},
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["initialize-cart"],
    };
  }

  return resultObject;
};

// Add a product to cart
export const addToCartFunction = async (
  product: ProductsDatabaseType,
  quantity: number,
  userId: string
) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };

  const productToBeAddedToCart: ProductsInCartsType = {
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

      resultObject = initializationResult;
    } else {
      //get docs
      var cartData = cartSnapshot.data();

      //check if product exists in cart already
      let productAlreadyInCart = false;
      for (let i = 0; i < cartData.products.length; i++) {
        //update cartData
        if (cartData.products[i].id == productToBeAddedToCart.id) {
          productAlreadyInCart = true;
          cartData.products[i].quantity += productToBeAddedToCart.quantity;
          cartData.subtotal_price += quantity * productToBeAddedToCart.price;
          break;
        }
      }

      //if not in cart, push as is
      if (!productAlreadyInCart) {
        cartData.products.push(productToBeAddedToCart);
        cartData.subtotal_price += productToBeAddedToCart.price * quantity;
      }

      //TODO: check quantity of product to add

      await setDoc(cartReference, cartData, { merge: true });

      resultObject = {
        result: cartData,
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: true,
        message: SuccessCodes["add-cart"],
      };
    }
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: {},
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : SuccessCodes["add-cart"],
    };
  }

  return resultObject;
};

// Remove a product from the cart
export const removeFromCartFunction = async (
  product: ProductsInCartsType,
  userId: string
) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };

  try {
    const cartReference = doc(db, "carts", userId);

    const cartSnapshot = await getDoc(cartReference);

    if (!cartSnapshot.exists()) {
      resultObject = {
        result: {},
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: false,
        message: ErrorCodes["remove-cart-cart-does-not-exist"],
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
        result: cartData,
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: true,
        message: SuccessCodes["remove-cart"],
      };
    } else {
      resultObject = {
        result: cartData,
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: false,
        message: ErrorCodes["remove-cart-product-does-not-exist"],
      };
    }
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: {},
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["remove-cart"],
    };
  }

  return resultObject;
};

// Clear cart
//TODO
export const clearCartFunction = async (userId: string) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };

  try {
    const cartReference = doc(db, "carts", userId);

    const cartSnapshot = await getDoc(cartReference);

    if (cartSnapshot.exists()) {
      const clearedCart: CartsDatabaseType = {
        ...cartSnapshot.data(),
        products: [],
        subtotal_price: 0,
        updated_at: new Date().toString(),
        user_id: userId,
      };

      await setDoc(cartReference, clearedCart);

      resultObject = {
        result: clearedCart,
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: true,
        message: SuccessCodes["clear-cart"],
      };
    } else {
      resultObject = {
        result: {},
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: true,
        message: ErrorCodes["clear-cart-no-cart"],
      };
    }
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: {},
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["clear-cart"],
    };
  }

  return resultObject;
};

// Get cart given ID
export const getCartViaIdFunction = async (userId: string) => {
  let resultObject: FunctionResult = {
    result: {},
    resultType: ResultTypeEnum.OBJECT,
    isSuccess: false,
    message: "",
  };

  try {
    const cartReference = doc(db, "carts", userId);

    const cartSnapshot = await getDoc(cartReference);

    if (cartSnapshot.exists()) {
      const information = cartSnapshot.data();
      const data: CartsDatabaseType = {
        id: userId,
        created_at: information.created_at,
        updated_at: information.created_at,
        products: information.products,
        subtotal_price: information.subtotal_price,
        user_id: information.user_id,
      };

      resultObject = {
        result: data,
        resultType: ResultTypeEnum.OBJECT,
        isSuccess: true,
        message: SuccessCodes["get-cart-given-id"],
      };
    } else {
      const initializationResult = await initializeNewCartFunction(userId);

      resultObject = initializationResult;
    }
  } catch (e: unknown) {
    const errorMessage = parseError(e);

    resultObject = {
      result: {},
      resultType: ResultTypeEnum.OBJECT,
      isSuccess: false,
      message: errorMessage ? errorMessage : ErrorCodes["get-cart-given-id"],
    };
  }

  return resultObject;
};
