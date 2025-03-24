"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "filled";
  inputSize?: "default" | "sm" | "lg";
  className?: string;
}

const inputBaseStyles = "flex w-full rounded-md border text-sm ring-offset-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const variantStyles = {
  default: "border-gray-700 bg-gray-800 text-gray-200",
  filled: "border-transparent bg-gray-700 text-gray-200 hover:bg-gray-600/80 focus:bg-gray-700",
};
const sizeStyles = {
  default: "h-10 px-4 py-2",
  sm: "h-8 px-3 py-1 text-xs",
  lg: "h-12 px-6 py-3 text-lg",
};

export const Input = ({ variant = "default", inputSize = "default", className, ...props }: InputProps) => {
  return <input className={`${inputBaseStyles} ${variantStyles[variant]} ${sizeStyles[inputSize]} ${className || ""}`} {...props} />;
};