import React, { ReactNode, createContext, useContext, useEffect } from "react";
import {
  onAuthStateChanged,
  getAuth,
  signOut,
  onIdTokenChanged,
  getIdToken,
} from "firebase/auth";
import app from "@/firebase/config";
import * as Constants from "../firebase/constants";
import nookies from "nookies";

import { useState } from "react";
import { isUserAuthorizedFunction } from "@/firebase/firebase_functions/users_function";

const auth = getAuth(app);

export const AuthContext = createContext({
  user: null,
  isAuthorized: false,
  loading: true,
  notification: "",
  notificationText: "",
  success: (text: string) => {},
  error: (text: string) => {},
  clear: () => {},
  reset: () => {},
  setUserAndAuthorization: (id: string, authorized: boolean) => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setAuthorized] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");
  const [notificationText, setNotificationText] = useState<string>("");

  const success = (text: string) => {
    window.scroll(0, 0);
    setNotificationText(text);
    setNotification(Constants.NOTIFICATION_STATES.SUCCESS);
  };

  const error = (text: string) => {
    window.scroll(0, 0);
    setNotificationText(text);
    setNotification(Constants.NOTIFICATION_STATES.ERROR);
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

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      console.log("Entered on ID Token Change");
      if (!user) {
        setUser("");
        setAuthorized(false);
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const token = await user.getIdToken();
        setUser(user.uid);
        nookies.set(undefined, "token", token, { path: "/" });
        const authorization = await isUserAuthorizedFunction(user.uid);
        setAuthorized(authorization.result);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
};
