"use client";

import { forwardRef } from "react";

interface ElevatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const ElevatedButton = forwardRef<
  HTMLButtonElement,
  ElevatedButtonProps
>(
  (
    { children, className = "", disabled = false, type = "button", ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`relative ${className}`}
        disabled={disabled}
        type={type}
        {...props}
      >
        <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black" />
        <span
          className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-10 py-1 text-base font-bold text-black transition duration-100 hover:text-gray-900"
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#81F495")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "white")
          }
        >
          {children}
        </span>
      </button>
    );
  },
);

ElevatedButton.displayName = "ElevatedButton";
