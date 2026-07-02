import React, { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter a 6-digit code"),
});

export const OTPVerification = () => {
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const inputRef = useRef(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("OTP verified:", data);
  };

  const handleOnChange = (e, index, field) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;
    const newOTP =
      field.value.substring(0, index) +
      value.substring(value.length - 1) +
      field.value.substring(index + 1);
    // Update react hook form value
    setValue("otp", newOTP.substring(0, 6), { shouldValidate: true });

    if (value && index < 5) {
      setActiveOTPIndex(index + 1);
    }
  };

  const handleOnKeyDown = (e, index, field) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOTP =
        field.value.substring(0, index) +
        " " +
        field.value.substring(index + 1);
      setValue("otp", newOTP.trim());
      if (index > 0) {
        setActiveOTPIndex(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      if (index > 0) setActiveOTPIndex(index - 1);
    } else if (e.key === "ArrowRight") {
      if (index < 5) setActiveOTPIndex(index + 1);
    }
  };

  const handleOnPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^[0-9]+$/.test(pastedData)) {
      setValue("otp", pastedData.padEnd(6, " "), { shouldValidate: true });
      setActiveOTPIndex(Math.min(pastedData.length, 5));
    }
  };

  // Helper to maintain focus
  React.useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  return (
    <Card glow className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-500/10 rounded-full">
            <ShieldCheck className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-gray-400 mb-8 text-sm px-4">
          We've sent a 6-digit verification code to your device. Enter it below
          to verify your identity.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center gap-2 sm:gap-3 w-full">
                  {Array.from({ length: 6 }, (_, index) => (
                    <motion.input
                      key={index}
                      ref={index === activeOTPIndex ? inputRef : null}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`
                        w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-white 
                        bg-gray-900/50 border-2 rounded-xl transition-all duration-200 outline-none
                        ${errors.otp ? "border-red-500/50 focus:border-red-500" : "border-gray-700 focus:border-blue-500"}
                      `}
                      value={field.value[index] || ""}
                      onChange={(e) => handleOnChange(e, index, field)}
                      onKeyDown={(e) => handleOnKeyDown(e, index, field)}
                      onFocus={() => setActiveOTPIndex(index)}
                      onPaste={handleOnPaste}
                      whileFocus={{ scale: 1.05 }}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-400"
                  >
                    {errors.otp.message}
                  </motion.span>
                )}
              </div>
            )}
          />

          <Button
            type="submit"
            className="w-full flex items-center justify-center"
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
              "Verify Code"
            )}
          </Button>
        </form>

        <div className="mt-8">
          <p className="text-sm text-gray-400">
            Didn't receive the code?{" "}
            <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Resend Code
            </button>
          </p>
        </div>
      </motion.div>
    </Card>
  );
};
