// src/shared/ui/input.tsx
import React, { useId } from "react";
import { cn } from "../lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, required, disabled, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  const inputElement = (
    <input
      id={inputId}
      ref={ref}
      aria-invalid={!!error}
      aria-required={required}
      aria-describedby={errorId}
      disabled={disabled}
      required={required}
      className={cn(
        "w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:border-green-500",
        className,
      )}
      {...props}
    />
  );

  if (label) {
    return (
      <div className="w-full">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {inputElement}
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return inputElement;
});

Input.displayName = "Input";
