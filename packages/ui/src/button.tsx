"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant: "primary" | "secondary";
  size: "md" | "lg";
  onClick?: () => void;
}

const variantStyles = {
  primary: "bg-blue-600 text-black hover:bg-blue-700 border-white border",
  secondary:
    "text-white bg-green-700 hover:bg-green-500 border-white border rounded-md",
};

const defaultStyles: String = "rounded-md flex justify-center content-center m-1";

const sizes = {
  md: "h-10 m-2 p-2",
  lg: "h-14 m-3 p-4",
};

export const Button = ({ children, variant, size, onClick }: ButtonProps) => {
  return (
    <button
      className={`${variantStyles[variant]} ${defaultStyles} ${sizes[size]}`}
      onClick={onClick || (() => alert(`Hello from your app!`))}
    >
      {children}
    </button>
  );
};