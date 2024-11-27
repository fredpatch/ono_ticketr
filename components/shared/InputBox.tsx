"use client";

import React from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

interface InputBoxProps {
  name: string;
  type?: string;
  id?: string;
  value?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputBox = ({
  name,
  type = "text",
  id,
  value,
  icon,
  placeholder,
  onChange,
  disabled = false,
}: InputBoxProps) => {
  const [passwordShown, setPasswordShown] = React.useState(false);
  return (
    <div className="relative w-[100%] mb-4">
      <input
        id={id}
        type={type === "password" && !passwordShown ? "password" : "text"}
        name={name}
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className="input-box"
        onChange={onChange}
      />
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
      )}
      {type === "password" && (
        <span
          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => setPasswordShown(!passwordShown)}
        >
          {passwordShown ? <IconEyeOff size={24} /> : <IconEye size={24} />}
        </span>
      )}
    </div>
  );
};

export default InputBox;
