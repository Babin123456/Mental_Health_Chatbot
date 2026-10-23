import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser as apiLogin, register as apiRegister, getProfile } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getProfile();
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.warn("Session verification failed, resetting credentials:", err.message);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserSession();
  }, [token]);

  const login = async (credentials) => {
    const res = await apiLogin(credentials);
    const newToken = res.data.token;
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
    if (res.data.user) {
      setUser(res.data.user);
    }
    return res.data;
  };

  const signup = async (userData) => {
    const res = await apiRegister(userData);
    const newToken = res.data.token;
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
    if (res.data.user) {
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isLoggedIn = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
