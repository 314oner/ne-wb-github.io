// src/shared/ui/select.tsx
import React, { useId } from "react";
import { cn } from "../lib/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, required, disabled, placeholder, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = error ? `${selectId}-error` : undefined;

    const selectElement = (
      <select
        id={selectId}
        ref={ref}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={errorId}
        disabled={disabled}
        required={required}
        className={cn(
          "w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:border-green-500",
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );

    if (label) {
      return (
        <div className="w-full">
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {selectElement}
          {error && (
            <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <>
        {selectElement}
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </>
    );
  },
);

Select.displayName = "Select";
