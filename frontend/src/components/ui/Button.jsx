import React from "react";
import { motion } from "framer-motion";

const variantStyles = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/30 border border-transparent",
  secondary:
    "bg-gray-800 text-white hover:bg-gray-700 shadow-md border border-gray-700",
  outline:
    "bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500/10",
  ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-gray-800",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-6 py-3 text-lg font-semibold",
};

export const Button = React.forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
        whileTap={disabled ? {} : { scale: 0.98, y: 1 }}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? "opacity-50 cursor-not-allowed grayscale" : "cursor-pointer"} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
