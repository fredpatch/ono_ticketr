import axios from "axios";
import { AuthResponse, SignUpParams, SignInParams } from "@/types";
import { toast } from "@/hooks/use-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const signup = async ({ fullname, email, password }: SignUpParams) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      fullname,
      email,
      password,
    });

    if (response.status === 201) {
      toast({
        description: "Account created successfully!",
      });
      return response.data;
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || "An error occurred during sign-up";

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    console.log("error signup -[authService] ==>", errorMessage);

    // Propagate the error to the caller
    throw new Error(errorMessage);
  }
};

export const signin = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, credentials);

    if (response.status === 200) {
      toast({
        title: "Success",
        description: "Signin successful",
      });
      return response.data;
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || "An error occurred during sign-in";

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });

    console.log("error signin -[authService] ==>", error);
    // Pass meaningful error message back to the caller
    throw new Error(`${error}` || "An error occurred during sign-in");
  }
};

export const signout = async (): Promise<void> => {
  await axios.post(`${API_URL}/auth/signout`);
};
