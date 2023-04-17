import React, { ReactNode, createContext, useContext, useEffect } from "react";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import app from "@/firebase/config";
import * as Constants from "../firebase/constants";

import { useState } from "react";

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
  isAuthorizedTrue: () => {},
  isAuthorizedFalse: () => {},
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

  const isAuthorizedTrue = () => {
    setAuthorized(true);
  };

  const isAuthorizedFalse = () => {
    setAuthorized(true);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userInput) => {
      if (userInput) {
        setUser(userInput);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
        isAuthorizedTrue,
        isAuthorizedFalse,
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
