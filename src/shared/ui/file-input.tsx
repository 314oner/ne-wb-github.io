// src/shared/ui/file-input.tsx
import React, { useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onFileChange?: (file: File | null) => void;
  error?: string;
  accept?: string;
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  onFileChange,
  error,
  accept = "image/*",
  className,
  id,
  disabled,
  required,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const inputId = id || generatedId;
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
    if (onFileChange) onFileChange(file);
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setFileName(null);
      if (onFileChange) onFileChange(null);
    }
  };

  const inputElement = (
    <div className="flex flex-col gap-2">
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "w-full text-sm text-gray-500 dark:text-gray-400",
          "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0",
          "file:text-sm file:font-semibold file:bg-green-600 file:text-white",
          "hover:file:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed",
          "cursor-pointer",
          className,
        )}
        {...props}
      />
      {fileName && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Выбран файл: {fileName}</span>
          <button
            type="button"
            onClick={handleClear}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            aria-label="Очистить выбранный файл"
          >
            ✕
          </button>
        </div>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-red-600 dark:text-red-400 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );

  if (label) {
    return (
      <div className="w-full">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {inputElement}
      </div>
    );
  }

  return inputElement;
};
