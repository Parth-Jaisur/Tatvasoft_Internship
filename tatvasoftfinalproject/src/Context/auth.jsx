import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Paths } from "../Utils/enum";
import { toast } from "react-toastify";
import Shared from "../Utils/Shared";

const initialUserValue = {
  id: 0,
  email: "",
  firstName: "",
  lastName: "",
  roleId: 0,
  role: "",
  password: "",
};

const initialState = {
  setUser: () => {},
  user: initialUserValue,
  signOut: () => {},
  appInitialize: false,
};

export const AuthContext = createContext(initialState);

export const AuthWrapper = ({ children }) => {
  const [appInitialize, setAppInitialize] = useState(false);
  const [user, _setUser] = useState(initialUserValue);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const setUser = (user) => {
    localStorage.setItem(Shared.LocalStorageKeys.USER, JSON.stringify(user));
    _setUser(user);
  };

  useEffect(() => {
    const itemStr =
      JSON.parse(localStorage.getItem(Shared.LocalStorageKeys.USER)) ||
      initialUserValue;

    if (!itemStr.id) {
     navigate(Paths.LoginForm);
    }
    _setUser(itemStr);
  }, [navigate]);

  const signOut = () => {
    setUser(initialUserValue);
    localStorage.removeItem(Shared.LocalStorageKeys.USER);
    navigate(Paths.LoginForm);
  };

  useEffect(() => {
    if (pathname === Paths.LoginForm && user.id) {
      navigate(Paths.Home);
    }

    if (!user.id) {
      return;
    }

    const access = Shared.hasAccess(pathname, user);
    if (!access) {
      toast.warning("Sorry, you are not authorized to access this page");
      navigate(Paths.LoginForm);
      return;
    }

    setAppInitialize(true);
  }, [pathname, user, navigate]);

  const value = {
    user,
    setUser,
    signOut,
    appInitialize,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthWrapper;