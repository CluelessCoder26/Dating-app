import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return score;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score; // 0 to 4
};

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");
  const strength = getPasswordStrength(password);
  const strengthColors = [
    "bg-gray-600",
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];
  const strengthLabels = ["Too Weak", "Weak", "Fair", "Good", "Strong"];

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Register data:", data);
  };

  return (
    <Card glow className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-400 mt-2">Join us and start connecting</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            icon={<Mail className="w-5 h-5" />}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Phone Number"
            type="tel"
            icon={<Phone className="w-5 h-5" />}
            placeholder="+1 (555) 000-0000"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <div className="space-y-3">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                icon={<Lock className="w-5 h-5" />}
                placeholder="Create a strong password"
                error={errors.password?.message}
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Password Strength Meter */}
            <div className="px-1">
              <div className="flex gap-1 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                {[1, 2, 3, 4].map((level) => (
                  <motion.div
                    key={level}
                    className={`h-full flex-1 transition-colors duration-300 ${
                      level <= strength
                        ? strengthColors[strength]
                        : "bg-transparent"
                    }`}
                    initial={false}
                    animate={{ opacity: level <= strength ? 1 : 0.2 }}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className="text-gray-400">Password strength:</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={strength}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={`font-medium ${strength > 0 ? strengthColors[strength].replace("bg-", "text-") : "text-gray-500"}`}
                  >
                    {password ? strengthLabels[strength] : "None"}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 flex items-center justify-center space-x-2"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                <span>Create Account</span>
                <UserPlus className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </Card>
  );
};
