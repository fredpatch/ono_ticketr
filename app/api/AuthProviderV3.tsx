"use client";

import { toast } from "@/hooks/use-toast";
import apiClient, { signout } from "@/services/authService";
import useAuthStore, { getAuthStore } from "@/store/store";
import { AuthUser, SignUpParams } from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

interface AuthContextProps {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: {
    fullname: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<void>;
  logout: () => void;
  user: any;
  access_token: string | null | any;
}

const AuthContextV3 = createContext<AuthContextProps | undefined>(undefined);

export const useAuthV3 = () => {
  const context = useContext(AuthContextV3);
  if (!context) {
    throw new Error("useAuthV3 must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // const [token, setAccessToken] = useState<string | any>(null);

  let { access_token, setAccessToken, setAuth, user, setLoading } =
    useAuthStore();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await apiClient.post(`/auth/signin`, credentials);

      if (response.status === 200) {
        const { access_token, ...userData } = response.data;
        setAuth(userData, access_token);
        setAccessToken(access_token);

        setLoading(false);
        toast({
          title: "Success",
          description: "Signin successful",
        });
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
    role?: string;
  }) => {
    try {
      const response = await apiClient.post(`/auth/signup`, credentials);

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "User Created, Please Signin with your credentials",
        });
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

  const logout = async () => {
    await signout();
  };

  const fetchMe = async () => {
    console.log("fetchMe =>", access_token);
    try {
      const response = await apiClient.get(`/auth/me`, {
        headers: {
          Authorization: access_token ? `Bearer ${access_token}` : "",
        },
      });

      if (response.status === 200) {
        // update the user and access token
        setAuth(response.data.user, access_token);
      }
    } catch (error) {
      // setAccessToken(null);
      console.log("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchMe();
  }, [access_token]);

  // setup auth interceptor
  useLayoutEffect(() => {
    const authInterceptor = apiClient.interceptors.request.use(
      (config: any) => {
        config.headers.Authorization =
          !config._retry && access_token
            ? `Bearer ${access_token}`
            : config.headers.Authorization;
        return config;
      }
    );

    return () => {
      apiClient.interceptors.request.eject(authInterceptor);
    };
  }, [access_token]);

  useLayoutEffect(() => {
    const refreshInterceptor = apiClient.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const originalRequest = error.config;
        // console.log("REFRESH INTERCEPTOR =>", error);

        if (
          error.response.status === 401 &&
          error.response.data.message === "No token provided"
        ) {
          try {
            const response = await apiClient.get("/auth/refresh-token");
            const { access_token: newAccessToken, user: newUser } =
              response.data;
            console.log(
              "NEW ACCESS TOKEN | REFRESH INTERCEPTOR =>",
              newAccessToken
            );
            console.log("NEW USER DATA | REFRESH INTERCEPTOR =>", newUser);

            setAccessToken(response.data.access_token);

            user = {
              username: response.data.user.personal_info.username,
              fullname: response.data.user.personal_info.fullname,
              role: response.data.user.role,
              profile_img: response.data.user.personal_info.profile_img,
              new_notification_available:
                false || response.data.user.new_notification_available,
            };

            setAuth(user, response.data.access_token);

            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
            originalRequest._retry = true;

            return apiClient(originalRequest);
          } catch (error) {
            setAccessToken(null);
          }
        }

        return Promise.reject(error);
      }
    );
    return () => {
      apiClient.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  return (
    <AuthContextV3.Provider
      value={{
        access_token,
        login,
        logout,
        register,
        user,
      }}
    >
      {children}
    </AuthContextV3.Provider>
  );
};
