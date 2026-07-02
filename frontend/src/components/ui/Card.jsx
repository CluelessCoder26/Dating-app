import React from "react";
import { motion } from "framer-motion";

export const Card = React.forwardRef(
  ({ children, className = "", glow = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`relative rounded-2xl bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 p-6 shadow-xl overflow-hidden ${
          glow
            ? "before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-blue-500/20 before:to-purple-500/20 before:blur-xl"
            : ""
        } ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";
