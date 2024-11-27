"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as authService from "@/services/authService";
import { AuthUser, SignUpParams } from "@/types";

import Loader from "@/components/shared/Loader";
import {
  lookInLocal,
  removeFromLocal,
  StoreInLocal,
} from "@/common/localeStore";
import { clearLocalSocialLinks } from "@/components/shared/EditProfile";
import { toast } from "@/hooks/use-toast";

interface AuthContextProps {
  userAuth: AuthUser | null;
  signup: (userData: SignUpParams) => Promise<void>;
  signin: (credentials: { email: string; password: string }) => Promise<void>;
  signout: () => void;
  loading: boolean;
  setUserAuth: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const defaultState: AuthUser = {
  access_token: null,
  profile_img: "",
  username: "",
  fullname: "",
  isAdmin: false,
  new_notification_available: false,
};

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userAuth, setUserAuth] = useState<AuthUser | null>(defaultState);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let userInLocal = lookInLocal("user");

    userInLocal
      ? setUserAuth(JSON.parse(userInLocal))
      : setUserAuth({ ...defaultState });

    setLoading(false); // Once user state is set
  }, []);

  const signup = async (userData: SignUpParams) => {
    try {
      const response = await authService.signup(userData);

      if (!response || !response.access_token) {
        throw new Error("Sign-up failed. Please try again.");
      }

      StoreInLocal("user", JSON.stringify(response));
      setUserAuth(response);
      setLoading(false); // Finish loading after redirect
      router.push("/");
    } catch (error: any) {
      console.error("Sign-up error:", error.message);
      // Optional: Display error toast here if needed
      toast({
        description: error.message,
        variant: "destructive",
      });
      setLoading(false); // Finish loading after redirect
    }
  };

  const signin = async (credentials: { email: string; password: string }) => {
    try {
      const response = await authService.signin(credentials);

      if (!response || !response.access_token) {
        throw new Error(
          "Authentication failed. Please check your credentials."
        );
      }

      // Store user data and update state on success
      StoreInLocal("user", JSON.stringify(response));
      setUserAuth(response);
      router.push("/");
      setLoading(false); // Finish loading after redirect
    } catch (error: any) {
      console.error("Sign-in error:", error.message);
    }
  };

  const signout = () => {
    setUserAuth(defaultState);
    removeFromLocal("user");
    clearLocalSocialLinks();
    router.push("/");
    setLoading(false); // Finish loading after redirect
  };

  return (
    <AuthContext.Provider
      value={{ userAuth, signup, signin, signout, loading, setUserAuth }}
    >
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
