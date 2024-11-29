"use client";

import React from "react";
import AnimationWrapper from "./AnimationWrapper";
import InputBox from "./InputBox";
import { IconLockCheck, IconLockQuestion } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { toast as passwordChangeToast } from "react-hot-toast";
import axios from "axios";

const password_validation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
const ServerDomain = process.env.NEXT_PUBLIC_API_URL as string;

const ChangePassword = () => {
  let { userAuth } = useAuth();
  let access_token = userAuth?.access_token;
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  let changePasswordForm = React.createRef<HTMLFormElement>();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!changePasswordForm.current) {
      return toast({ description: "Form not found", variant: "destructive" });
    }

    let form = new FormData(changePasswordForm.current);
    let formData: Record<string, any> = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { currentPassword, newPassword } = formData;

    if (!currentPassword.length || !newPassword.length) {
      return toast({
        description: "All fields are required",
        variant: "destructive",
      });
    }

    // TODO: Add form validation
    if (
      !password_validation.test(currentPassword) ||
      !password_validation.test(newPassword)
    ) {
      return toast({
        description:
          "Password should be between 6 to 20 characters and should contain at least 1 uppercase letter, 1 lowercase letter and 1 digit.",
        variant: "destructive",
      });
    }

    if (currentPassword === newPassword) {
      return toast({
        description: "New password can't be same as current password",
        variant: "destructive",
      });
    }

    if (e.target.className.includes("disable")) {
      return;
    }

    e.target.classList.add("disable");
    let loadingToast = passwordChangeToast.loading("Please wait...");

    // TODO: Add change password logic
    try {
      const response = await axios.post(
        ServerDomain + "/private/change-password",
        formData,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      if (!response) {
        throw new Error("Network response was not ok");
      }

      passwordChangeToast.dismiss(loadingToast);
      e.target.classList.remove("disable");
      toast({
        description: `${response.data.message}`,
      });
      // window.location.reload();
      setNewPassword("");
      setOldPassword("");
    } catch (error) {
      passwordChangeToast.dismiss(loadingToast);
      e.target.classList.remove("disable");
      toast({
        title: "Error",
        description: "An error occurred during password change",
        variant: "destructive",
      });
      console.error("Error changing password:", error);
    }
  };
  return (
    <AnimationWrapper>
      <form action="" ref={changePasswordForm}>
        <h1 className="max-md:hidden">Change Password</h1>
        <div className="py-10 w-full md:max-w-[400px]">
          <InputBox
            name="currentPassword"
            value={oldPassword}
            type="password"
            placeholder="Current Password"
            icon={<IconLockQuestion />}
          />

          <InputBox
            name="newPassword"
            value={newPassword}
            type="password"
            placeholder="New Password"
            icon={<IconLockCheck />}
          />

          <button
            onClick={handleSubmit}
            className="btn-dark px-10 "
            type="submit"
          >
            Change Password
          </button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePassword;
