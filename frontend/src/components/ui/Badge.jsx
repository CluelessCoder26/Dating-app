import React from "react";

const variantStyles = {
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  default: "bg-gray-500/10 text-gray-300 border-gray-500/20",
};

export const Badge = ({
  variant = "default",
  children,
  className = "",
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
