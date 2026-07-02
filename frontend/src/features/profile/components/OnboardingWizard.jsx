import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import {
  User,
  MapPin,
  Heart,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const steps = ["Welcome", "Basic Info", "Bio", "Interests"];

export const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const nextStep = () =>
    setCurrentStep((p) => Math.min(steps.length - 1, p + 1));
  const prevStep = () => setCurrentStep((p) => Math.max(0, p - 1));

  const onSubmit = (data) => {
    if (currentStep < steps.length - 1) {
      nextStep();
    } else {
      console.log("Final Data:", data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-6">
      <div className="mb-8 flex items-center justify-between">
        {steps.map((step, idx) => (
          <div
            key={step}
            className="flex flex-col items-center gap-2 flex-1 relative"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 z-10 ${idx <= currentStep ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "bg-gray-800 text-gray-500 border border-gray-700"}`}
            >
              {idx < currentStep ? "✓" : idx + 1}
            </div>
            <span
              className={`text-xs font-medium mt-2 transition-colors ${idx <= currentStep ? "text-blue-400" : "text-gray-500"}`}
            >
              {step}
            </span>
            {idx < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 transition-colors duration-300 ${idx < currentStep ? "bg-blue-600" : "bg-gray-800"}`}
                style={{ width: "calc(100% - 20px)" }}
              />
            )}
          </div>
        ))}
      </div>

      <Card
        glow
        className="overflow-hidden min-h-[400px] flex flex-col relative"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                className="absolute inset-0 flex flex-col justify-center px-6"
              >
                {currentStep === 0 && (
                  <div className="text-center space-y-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mx-auto w-24 h-24 bg-gradient-to-tr from-blue-600/30 to-purple-600/30 rounded-full flex items-center justify-center mb-4"
                    >
                      <Sparkles className="w-10 h-10 text-blue-400" />
                    </motion.div>
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Welcome to Spark!
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                      Let's craft a profile that truly represents you and helps
                      you find your perfect match.
                    </p>
                  </div>
                )}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        The Basics
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Just the essentials to get started.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        icon={<User className="w-4 h-4" />}
                        placeholder="John Doe"
                        {...register("fullName", {
                          required: "Name is required",
                        })}
                        error={errors.fullName?.message}
                      />

                      <Input
                        label="Location"
                        icon={<MapPin className="w-4 h-4" />}
                        placeholder="New York, NY"
                        {...register("location")}
                      />
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Your Story
                      </h3>
                      <p className="text-gray-400 text-sm">
                        What makes you, you?
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-sm font-medium text-gray-300 ml-1">
                        About Me
                      </label>
                      <textarea
                        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 transition-all focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none resize-none h-40"
                        placeholder="I'm a weekend adventurer who loves discovering new coffee spots..."
                        {...register("bio")}
                      />
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Your Interests
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Find people who love what you love.
                      </p>
                    </div>
                    <Input
                      label="Top Interests"
                      icon={<Heart className="w-4 h-4" />}
                      placeholder="e.g. Photography, Hiking, Coffee (comma separated)"
                      {...register("interests")}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-auto pt-6 border-t border-gray-800/50 px-6 pb-6">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              className={
                currentStep === 0 ? "opacity-0 pointer-events-none" : ""
              }
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="min-w-[140px]"
            >
              {currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}{" "}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
