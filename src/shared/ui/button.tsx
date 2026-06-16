// src/shared/ui/button.tsx
import React from "react";
import { cn } from "../lib/cn";

const BUTTON_VARIANTS = {
  primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed",
  outline: "border border-gray-300 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed",
} as const;

const BUTTON_SIZES = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
} as const;

type ButtonVariant = keyof typeof BUTTON_VARIANTS;
type ButtonSize = keyof typeof BUTTON_SIZES;

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "primary", size = "md", isLoading = false, disabled, className, ...props }) => {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2";
  return (
    <button
      className={cn(base, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};
