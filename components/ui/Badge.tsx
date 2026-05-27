import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: "solid" | "outline" | "subtle";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  color = "#3b82f6",
  variant = "subtle",
  size = "sm",
  className = "",
}: BadgeProps) {
  const sizeClasses = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  const baseStyle: React.CSSProperties =
    variant === "subtle"
      ? { backgroundColor: `${color}18`, color, border: `1px solid ${color}30` }
      : variant === "outline"
        ? { backgroundColor: "transparent", color, border: `1px solid ${color}` }
        : { backgroundColor: color, color: "#fff" };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${className}`}
      style={baseStyle}
    >
      {children}
    </span>
  );
}
