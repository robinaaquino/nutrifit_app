import React, { ReactNode, createContext, useContext, useEffect } from "react";
import { getAuth, signOut, onIdTokenChanged } from "firebase/auth";
import app from "@/firebase/config";
import { NotificationEnum } from "@/firebase/constants/enum_constants";
import nookies from "nookies";

import { useState } from "react";
import {
  isUserAuthorizedFunction,
  getUserViaEmailFunction,
  addUserFunction,
} from "@/firebase/firebase_functions/users_functions";
import {
  addToCartFunction,
  removeFromCartFunction,
} from "@/firebase/firebase_functions/cart_functions";
import { getImageInProduct } from "@/firebase/helpers";
import { useRouter } from "next/navigation";

const auth = getAuth(app);

export const AuthContext = createContext({
  user: null,
  isAuthorized: false,
  loading: true,
  notification: "",
  notificationText: "",
  cart: {},
  success: (text: string) => {},
  error: (text: string) => {},
  clear: () => {},
  reset: () => {},
  setUserAndAuthorization: (id: string, authorized: boolean) => {},
  addToCart: (product: any, quantity: any, user?: any) => {},
  removeFromCart: (product: any) => {},
  deleteCartInCookiesAndContext: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");
  const [notificationText, setNotificationText] = useState<string>("");
  const [cart, setCart] = useState<any>(null);
  const router = useRouter();

  const success = (text: string) => {
    window.scroll(0, 0);
    setNotificationText(text);
    setNotification(NotificationEnum.SUCCESS);
  };

  const error = (text: string) => {
    window.scroll(0, 0);
    setNotificationText(text);
    setNotification(NotificationEnum.ERROR);
  };

  const clear = () => {
    setNotificationText("");
    setNotification("");
  };

  const reset = () => {
    setUser(null);
    setAuthorized(false);
    setLoading(false);
    setNotificationText("");
    setNotification("");
  };

  const setUserAndAuthorization = (id: string, authorized: boolean) => {
    setUser(id);
    setAuthorized(authorized);
  };

  const isProductInArray = (product: any, products: any) => {
    for (let i = 0; i < products.length; i++) {
      if (product.id == products[i].id) {
        return i;
      }
    }
    return -1;
  };

  const addProductToContextCart = (product: any, quantity: any) => {
    const productToBeAddedToCart = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      quantity: quantity,
      image: product.image,
    };

    if (cart == null) {
      const cartObject = {
        created_at: new Date().toString(),
        products: [productToBeAddedToCart],
        subtotal_price: product.price * quantity,
        updated_at: new Date().toString(),
        user_id: user ? user : null,
      };
      setCart(cartObject);
    } else {
      var cartObject = cart;

      const productIndex = isProductInArray(product, cartObject.products);

      if (productIndex != -1) {
        cartObject.products[productIndex].quantity =
          cartObject.products[productIndex].quantity + quantity;
        cartObject.subtotal_price =
          cartObject.subtotal_price + product.price * quantity;
        cartObject.updated_at = new Date().toString();
        return true;
      } else {
        cartObject.products = [...cartObject.products, productToBeAddedToCart];
        cartObject.subtotal_price =
          cartObject.subtotal_price + product.price * quantity;
        cartObject.updated_at = new Date().toString();
        setCart(cartObject);
        return true;
      }
    }
  };

  const removeProductFromContextCart = (product: any) => {
    if (cart) {
      if (cart.length == 0) {
        var cartObject = cart;
        let previousProductsInCart = cartObject.products;

        for (let i = 0; i < cartObject.products.length; i++) {
          if (product.id == cartObject.products[i].id) {
            previousProductsInCart.splice(i, 1);
            break;
          }
        }
        cartObject.products = previousProductsInCart;

        cartObject.subtotal_price =
          cartObject.subtotal_price - product.price * product.quantity;
        cartObject.updated_at = new Date().toString();

        setCart(cartObject);
      }
    }

    return true;
  };

  const addProductToCookiesCart = (product: any, quantity: any) => {
    const productToBeAddedToCart = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      quantity: quantity,
      image: product.image,
    };

    const cookies = nookies.get(undefined);

    if (cookies.cart) {
      var cartObjectFromCookies = JSON.parse(cookies.cart);

      const productIndex = isProductInArray(
        product,
        cartObjectFromCookies.products
      );

      if (productIndex != -1) {
        cartObjectFromCookies.products[productIndex].quantity =
          cartObjectFromCookies.products[productIndex].quantity + quantity;
        cartObjectFromCookies.subtotal_price =
          cartObjectFromCookies.subtotal_price + product.price * quantity;
        cartObjectFromCookies.updated_at = new Date().toString();

        nookies.set(undefined, "cart", JSON.stringify(cartObjectFromCookies), {
          path: "/",
        });
        return true;
      } else {
        let previousProducts = cartObjectFromCookies.products;
        previousProducts.push(productToBeAddedToCart);
        cartObjectFromCookies.subtotal_price =
          cartObjectFromCookies.subtotal_price + product.price * quantity;
        cartObjectFromCookies.updated_at = new Date().toString();

        nookies.set(undefined, "cart", JSON.stringify(cartObjectFromCookies), {
          path: "/",
        });

        return true;
      }
    } else {
      //initialize cart in cookies
      const cartObject = {
        created_at: new Date().toString(),
        products: [productToBeAddedToCart],
        subtotal_price: product.price * quantity,
        updated_at: new Date().toString(),
        user: user ? user : null,
      };

      nookies.set(undefined, "cart", JSON.stringify(cartObject), {
        path: "/",
      });
      return true;
    }
  };

  const removeProductFromCookiesCart = (product: any) => {
    const cookies = nookies.get(undefined);

    if (cookies.cart != undefined) {
      var cartObjectFromCookies = JSON.parse(cookies.cart);

      let previousProductsInCart = cartObjectFromCookies.products;

      for (let i = 0; i < cartObjectFromCookies.products.length; i++) {
        if (product.id == cartObjectFromCookies.products[i].id) {
          previousProductsInCart.splice(i, 1);
          break;
        }
      }
      cartObjectFromCookies.products = previousProductsInCart;

      cartObjectFromCookies.subtotal_price =
        cartObjectFromCookies.subtotal_price - product.price * product.quantity;
      cartObjectFromCookies.updated_at = new Date().toString();

      nookies.set(undefined, "cart", JSON.stringify(cartObjectFromCookies), {
        path: "/",
      });
      return true;
    } else {
      return false;
    }
  };

  const addToCart = async (product: any, quantity: any, user?: any) => {
    const productToBeAddedToCart = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      quantity: quantity,
      image: getImageInProduct(product),
    };

    if (user) {
      const addCartResult = await addToCartFunction(product, quantity, user);

      if (addCartResult.isSuccess) {
        setCart(addCartResult.result);
        nookies.set(undefined, "cart", JSON.stringify(addCartResult.result), {
          path: "/",
        });
        success("Successfully added to cart");
      } else {
        error(addCartResult.message);
      }
    } else {
      const contextResult = addProductToContextCart(
        productToBeAddedToCart,
        quantity
      );
      const cookieResult = addProductToCookiesCart(
        productToBeAddedToCart,
        quantity
      );

      success("Successful in adding product to cart");
    }
  };

  const removeFromCart = async (product: any) => {
    if (user) {
      const removeFromCartResult = await removeFromCartFunction(product, user);

      if (removeFromCartResult.isSuccess) {
        removeProductFromContextCart(product);
        removeProductFromCookiesCart(product);
        success("Successful in removing product from cart");
      } else {
        error(removeFromCartResult.message);
      }
    } else {
      removeProductFromContextCart(product);
      removeProductFromCookiesCart(product);
      success("Successful in removing product from cart");
    }
  };

  const deleteCartInCookiesAndContext = async () => {
    if (cart != null) {
      setCart(null);
    }

    nookies.set(undefined, "cart", "", { path: "/" });
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (userInfo) => {
      if (!userInfo) {
        setUser("");
        setAuthorized(false);
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const token = await userInfo.getIdToken();
        setUser(userInfo.uid);
        nookies.set(undefined, "token", token, { path: "/" });

        const authorization = await isUserAuthorizedFunction(userInfo.uid);
        setAuthorized(authorization.result);

        //check if user already has account
        const getUserViaEmailResult = await getUserViaEmailFunction(
          userInfo.email || ""
        );
        if (!getUserViaEmailResult.isSuccess) {
          const addResult = await addUserFunction({
            email: userInfo.email || "",
            id: userInfo.uid,
          });

          if (addResult.isSuccess) {
            success("Successful in logging in");
            router.push("/");
          } else {
            error(addResult.message);
          }
        }
      }
      setLoading(false);
    });

    if (!cart) {
      const cookies = nookies.get(undefined);
      if (cookies.cart) {
        setCart(JSON.parse(cookies.cart));
      }
    }

    return () => unsubscribe();
  }, []);

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.getIdToken(true);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(handle);
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthorized,
        loading,
        success,
        error,
        clear,
        notification,
        notificationText,
        reset,
        setUserAndAuthorization,
        cart,
        addToCart,
        removeFromCart,
        deleteCartInCookiesAndContext,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const logout = async () => {
  const auth = getAuth();
  nookies.destroy(undefined, "token");
  nookies.destroy(undefined, "cart");
  await signOut(auth);
};
