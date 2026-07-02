import React from "react";
import { Card } from "../ui/Card";
import { motion } from "framer-motion";

export const AIInsightCard = ({
  compatibilityScore,
  strengths,
  challenges,
  summary,
}) => {
  return (
    <Card
      glow
      className="border-purple-500/30 before:from-indigo-500/20 before:to-fuchsia-500/20 relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-400 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-fuchsia-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          AI Compatibility Insight
        </h3>
        <div className="text-center">
          <span className="block text-3xl font-black text-white">
            {compatibilityScore}%
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-gray-400">
            Score
          </span>
        </div>
      </div>

      <div className="space-y-5">
        <p className="text-gray-200 text-sm leading-relaxed italic">
          "{summary}"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-green-400 font-semibold mb-2">
              Strengths
            </h4>
            <ul className="space-y-2">
              {strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <span className="text-green-400 mt-0.5">•</span>
                  {strength}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-yellow-400 font-semibold mb-2">
              Challenges
            </h4>
            <ul className="space-y-2">
              {challenges.map((challenge, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (strengths.length + index) * 0.1 }}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <span className="text-yellow-400 mt-0.5">•</span>
                  {challenge}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
