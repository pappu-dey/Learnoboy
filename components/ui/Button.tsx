import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  style,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  }[size];

  const variantStyles: React.CSSProperties = {
    primary: {
      backgroundColor: "var(--link-color)",
      color: "#ffffff",
    },
    secondary: {
      backgroundColor: "var(--bg-surface)",
      color: "var(--text-primary)",
      border: "1px solid var(--border-color)",
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--text-secondary)",
    },
    danger: {
      backgroundColor: "#ef4444",
      color: "#ffffff",
    },
  }[variant] as React.CSSProperties;

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses} ${className}
      `}
      style={{ ...variantStyles, ...style }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
