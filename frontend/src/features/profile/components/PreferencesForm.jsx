import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Activity, Settings2 } from "lucide-react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export const PreferencesForm = () => {
  const [distance, setDistance] = useState(25);
  const [ageRange, setAgeRange] = useState({ min: 18, max: 35 });
  const [interestedIn, setInterestedIn] = useState("everyone");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <Card className="w-full bg-gray-900 border-gray-800 p-6 space-y-8">
      <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Settings2 className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Discovery Preferences</h2>
      </div>

      {/* Distance Preference */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-300">
              Maximum Distance
            </label>
          </div>
          <span className="text-sm font-bold text-purple-400">
            {distance} miles
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={distance}
          onChange={(e) => setDistance(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>1 mi</span>
          <span>100 mi</span>
        </div>
      </div>

      {/* Age Range Preference */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-300">
              Age Range
            </label>
          </div>
          <span className="text-sm font-bold text-purple-400">
            {ageRange.min} - {ageRange.max}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="18"
            max="100"
            value={ageRange.min}
            onChange={(e) =>
              setAgeRange({
                ...ageRange,
                min: Math.min(parseInt(e.target.value), ageRange.max - 1),
              })
            }
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />

          <input
            type="range"
            min="18"
            max="100"
            value={ageRange.max}
            onChange={(e) =>
              setAgeRange({
                ...ageRange,
                max: Math.max(parseInt(e.target.value), ageRange.min + 1),
              })
            }
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>
      </div>

      {/* Gender Preference */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-gray-400" />
          <label className="text-sm font-medium text-gray-300">
            Interested In
          </label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["women", "men", "everyone"].map((gender) => (
            <button
              key={gender}
              onClick={() => setInterestedIn(gender)}
              className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                interestedIn === gender
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <span className="capitalize">{gender}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
            />
          ) : null}
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </Card>
  );
};
