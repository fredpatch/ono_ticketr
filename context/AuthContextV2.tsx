"use client";

import React, { createContext, useContext, useEffect } from "react";

import { getAuthStore } from "@/store/store";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/services/authService";

const AuthContext = createContext({
  login: async (credentials: { email: string; password: string }) => {},
  register: async (credentials: {
    fullname: string;
    email: string;
    password: string;
  }) => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProviderV2 = ({ children }: { children: React.ReactNode }) => {
  let { setAuth, logout, user, setLoading, setAccessToken, access_token } =
    getAuthStore();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        credentials
      );

      if (response.status === 200) {
        setLoading(false);
        toast({
          title: "Success",
          description: "Signin successful",
        });

        const {
          username,
          fullname,
          role,
          profile_img,
          access_token,
          new_notification_available,
        } = response.data;

        user = {
          username,
          fullname,
          role,
          profile_img,
          new_notification_available,
        };

        setAccessToken(access_token);
        setAuth(user, access_token);
      }

      console.log("Login response:", access_token);
    } catch (error: any) {
      console.error("Login failed:", error);
      // Optional: Display error toast here if needed
      toast({
        description: error?.response?.data?.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const register = async (credentials: {
    fullname: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        credentials
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "User created",
        });
        const {
          username,
          fullname,
          role,
          profile_img,
          access_token,
          refresh_token,
          new_notification_available,
        } = response.data;

        user = {
          username,
          fullname,
          role,
          profile_img,
          new_notification_available: new_notification_available,
        };

        setAuth(user, access_token);
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Sign-up error:", error?.response?.data?.message);
      // Optional: Display error toast here if needed
      toast({
        description: error?.response?.data?.message,
        variant: "destructive",
      });
      setLoading(false); // Finish loading after redirect
    }
  };

  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     try {
  //       // Attempt to refresh token on app load
  //       const response = await apiClient.post("/auth/refresh-token");
  //       const { access_token } = response.data;

  //       const userResponse = await apiClient.get("/auth/me", {
  //         headers: { Authorization: `Bearer ${access_token}` },
  //       });

  //       const user = userResponse.data;
  //       console.log("user", user);
  //       setAuth(user, access_token);
  //     } catch (error) {
  //       console.error("Failed to fetch user details:", error);
  //       logout(); // Clear state and log out the user
  //     }
  //   };

  //   initializeAuth();
  // }, []);

  const contextValue = {
    access_token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  console.log(contextValue);
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthV2 must be used within an AuthProvider");
  }
  return context;
};
