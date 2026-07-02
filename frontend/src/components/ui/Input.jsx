import React from "react";
import { motion } from "framer-motion";

export const Input = React.forwardRef(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-gray-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <motion.input
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            className={`
              w-full bg-gray-900/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500
              transition-all duration-200 outline-none
              ${icon ? "pl-10" : ""}
              ${
                error
                  ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 bg-red-500/5"
                  : "border-gray-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 hover:border-gray-600/50"
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 ml-1"
          >
            {error}
          </motion.span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
