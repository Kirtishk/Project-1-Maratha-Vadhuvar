// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user already logged in
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  const login = (email, password) => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const admin2= import.meta.env.VITE_ADMIN2_EMAIL;
    const admin2Password = import.meta.env.VITE_ADMIN2_PASSWORD;

    if (email === adminEmail && password === adminPassword || email === admin2 && password === admin2Password) {
      const user = { email, role: "admin" };
      setCurrentUser(user);
      localStorage.setItem("adminUser", JSON.stringify(user));
      return { success: true };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("adminUser");
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
