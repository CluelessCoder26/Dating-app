import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Camera,
  UserCheck,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

export const MediaUploader = () => {
  const [uploadState, setUploadState] = useState("idle");
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    setUploadState("uploading");
    setProgress(0);
    // Simulate the sequence
    const sequence = [
      { state: "uploading", duration: 1500, progress: 20 },
      { state: "optimizing", duration: 1500, progress: 40 },
      { state: "ai_verification", duration: 2000, progress: 60 },
      { state: "face_detection", duration: 2000, progress: 80 },
      { state: "authenticity_check", duration: 2000, progress: 95 },
      { state: "verified", duration: 1000, progress: 100 },
    ];

    let delay = 0;
    sequence.forEach((step, index) => {
      delay += step.duration;
      setTimeout(() => {
        setUploadState(step.state);
        setProgress(step.progress);
      }, delay);
    });
  };

  const resetUpload = () => {
    setUploadState("idle");
    setProgress(0);
  };

  const renderStateContent = () => {
    switch (uploadState) {
      case "idle":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-8 space-y-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Camera className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Upload Profile Photo
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Must contain a clear view of your face
              </p>
            </div>
            <div className="flex gap-4 mt-4">
              <Button onClick={handleUpload} variant="primary">
                <Upload className="w-4 h-4 mr-2" />
                Select Photo
              </Button>
            </div>
          </motion.div>
        );
      case "verified":
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-white">AI Verified</h3>
            <p className="text-gray-400 text-sm">
              Your photo has been successfully verified.
            </p>
            <Button onClick={resetUpload} variant="outline" className="mt-4">
              Upload Another
            </Button>
          </motion.div>
        );
      case "error":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 space-y-4"
          >
            <AlertCircle className="w-16 h-16 text-red-500" />
            <h3 className="text-xl font-bold text-white">
              Verification Failed
            </h3>
            <p className="text-gray-400 text-sm">
              We couldn't detect a clear face in this photo.
            </p>
            <Button onClick={resetUpload} variant="outline" className="mt-4">
              Try Again
            </Button>
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 space-y-6 w-full max-w-md mx-auto"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                {uploadState === "face_detection" && (
                  <UserCheck className="w-6 h-6 text-purple-300" />
                )}
                {uploadState === "ai_verification" && (
                  <ImageIcon className="w-6 h-6 text-purple-300" />
                )}
              </div>
            </div>

            <div className="w-full text-center space-y-2">
              <h3 className="text-lg font-semibold text-white capitalize">
                {uploadState.replace("_", " ")}...
              </h3>

              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
              <p className="text-xs text-gray-400">{progress}% Complete</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <Card className="w-full overflow-hidden bg-gray-900 border-gray-800">
      <div className="min-h-[300px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={uploadState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderStateContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
};
