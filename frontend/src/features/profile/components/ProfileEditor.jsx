import React, { useState, useEffect } from "react";
import { Card } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/Input";
import {
  MapPin,
  Target,
  Coffee,
  Loader2,
  CheckCircle,
  Save,
} from "lucide-react";

export const ProfileEditor = () => {
  const [saveStatus, setSaveStatus] = useState("idle");
  const [formData, setFormData] = useState({
    bio: "I love exploring the city and finding new coffee shops. Always down for an impromptu road trip or a lazy Sunday watching movies.",
    location: "New York, NY",
    goals: "Looking for a serious relationship",
    lifestyle: "Active, Non-smoker, Social drinker",
  });

  // Autosave simulation effect
  useEffect(() => {
    // Only trigger saving if it's not the initial mount
    const timer = setTimeout(() => {
      setSaveStatus("saving");
      setTimeout(() => {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2500);
      }, 1000);
    }, 1200);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Card
      glow
      className="max-w-2xl w-full mx-auto p-0 overflow-hidden space-y-0"
    >
      <div className="bg-gray-800/40 p-6 flex items-center justify-between border-b border-gray-700/50">
        <div>
          <h2 className="text-2xl font-bold text-white">Profile Editor</h2>
          <p className="text-sm text-gray-400">
            Manage your personal information and preferences.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/50 border border-gray-700 transition-all min-w-[110px] justify-center">
          {saveStatus === "idle" && (
            <>
              <Save className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">All Saved</span>
            </>
          )}
          {saveStatus === "saving" && (
            <>
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-sm text-blue-400">Saving...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Saved</span>
            </>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300 ml-1">
            About Me (Bio)
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none min-h-[120px] transition-all"
            placeholder="Write something interesting about yourself..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            icon={<MapPin className="w-4 h-4" />}
            placeholder="City, State"
          />

          <Input
            label="Relationship Goals"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            icon={<Target className="w-4 h-4" />}
            placeholder="e.g. Serious relationship"
          />
        </div>

        <Input
          label="Lifestyle & Habits"
          name="lifestyle"
          value={formData.lifestyle}
          onChange={handleChange}
          icon={<Coffee className="w-4 h-4" />}
          placeholder="e.g. Active, Social drinker"
        />
      </div>
    </Card>
  );
};
