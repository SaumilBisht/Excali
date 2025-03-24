"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const cardBaseStyles = "rounded-lg border border-gray-700 bg-gray-800 text-gray-200 shadow-md";
const headerStyles = "flex flex-col space-y-1.5 p-6";
const titleStyles = "text-xl font-semibold";
const descriptionStyles = "text-sm text-gray-400";
const contentStyles = "p-6 pt-0";
const footerStyles = "flex items-center p-6 pt-0";

export const Card = ({ children, className }: CardProps) => {
  return <div className={`${cardBaseStyles} ${className || ""}`}>{children}</div>;
};

export const CardHeader = ({ children, className }: CardProps) => {
  return <div className={`${headerStyles} ${className || ""}`}>{children}</div>;
};

export const CardTitle = ({ children, className }: CardProps) => {
  return <h3 className={`${titleStyles} ${className || ""}`}>{children}</h3>;
};

export const CardDescription = ({ children, className }: CardProps) => {
  return <p className={`${descriptionStyles} ${className || ""}`}>{children}</p>;
};

export const CardContent = ({ children, className }: CardProps) => {
  return <div className={`${contentStyles} ${className || ""}`}>{children}</div>;
};

export const CardFooter = ({ children, className }: CardProps) => {
  return <div className={`${footerStyles} ${className || ""}`}>{children}</div>;
};
