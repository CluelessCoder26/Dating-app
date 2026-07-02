import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { Card } from "../../../components/ui/Card";

export const TrustVisualization = ({
  score = 85,
  verificationLevel = "verified",
  warnings = [],
}) => {
  // Calculate color based on score
  const getScoreColor = (s) => {
    if (s >= 80) return "text-green-400";
    if (s >= 60) return "text-yellow-400";
    return "text-red-400";
  };
  const getScoreBg = (s) => {
    if (s >= 80) return "stroke-green-500";
    if (s >= 60) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="w-full bg-gray-900 border-gray-800 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-purple-500" />
          Trust & Safety Profile
        </h2>
        <Info className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Trust Score Visual */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                className="stroke-gray-800"
                strokeWidth="8"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />

              <motion.circle
                className={getScoreBg(score)}
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Score
              </span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-white">
              Excellent Trust Score
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
              Your account health is great. Keep following our community
              guidelines.
            </p>
          </div>
        </div>

        {/* Verification Status */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
            Verification Status
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
              <CheckCircle
                className={`w-5 h-5 ${verificationLevel !== "none" ? "text-green-500" : "text-gray-600"}`}
              />
              <div>
                <p className="text-sm font-medium text-white">Email & Phone</p>
                <p className="text-xs text-gray-400">Basic contact verified</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
              <ShieldCheck
                className={`w-5 h-5 ${["verified", "gold"].includes(verificationLevel) ? "text-blue-500" : "text-gray-600"}`}
              />
              <div>
                <p className="text-sm font-medium text-white">
                  Photo Verification
                </p>
                <p className="text-xs text-gray-400">AI face match confirmed</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 opacity-50">
              <ShieldAlert
                className={`w-5 h-5 ${verificationLevel === "gold" ? "text-yellow-500" : "text-gray-600"}`}
              />
              <div>
                <p className="text-sm font-medium text-white">
                  Background Check
                </p>
                <p className="text-xs text-gray-400">Not completed yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Warnings */}
      {warnings.length > 0 && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-semibold text-red-400">
              Safety Notices
            </h3>
          </div>
          <ul className="list-disc list-inside text-sm text-red-300/80 space-y-1">
            {warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
