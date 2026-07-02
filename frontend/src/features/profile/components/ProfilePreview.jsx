import React, { useState } from "react";
import { Card } from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import {
  Eye,
  EyeOff,
  MapPin,
  Briefcase,
  GraduationCap,
  Ruler,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ProfilePreview = () => {
  const [isPreviewPublic, setIsPreviewPublic] = useState(true);

  return (
    <div className="max-w-md w-full mx-auto space-y-4">
      <div className="flex justify-between items-center bg-gray-900/60 p-2 rounded-xl backdrop-blur-md border border-gray-800">
        <Button
          variant={isPreviewPublic ? "primary" : "ghost"}
          size="sm"
          onClick={() => setIsPreviewPublic(true)}
          className="flex-1 rounded-lg"
        >
          <Eye className="w-4 h-4 mr-2" /> Public View
        </Button>
        <Button
          variant={!isPreviewPublic ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsPreviewPublic(false)}
          className="flex-1 rounded-lg"
        >
          <EyeOff className="w-4 h-4 mr-2" /> Private View
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isPreviewPublic ? "public" : "private"}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.2 }}
        >
          <Card className="overflow-hidden p-0 border-0 shadow-2xl shadow-black/50 ring-1 ring-gray-800">
            <div className="h-80 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl font-bold text-white drop-shadow-md">
                  Sarah, 26
                </h2>
                <div className="flex items-center text-gray-300 mt-2 gap-4 text-sm font-medium">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-blue-400" /> Brooklyn,
                    NY
                  </span>
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1 text-purple-400" />{" "}
                    Designer
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6 bg-gray-950">
              {!isPreviewPublic && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 text-sm text-indigo-200 flex items-start gap-2"
                >
                  <EyeOff className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    <strong>Private Mode Active.</strong> You are viewing hidden
                    fields (highlighted in orange) that other users cannot see
                    on your public profile.
                  </p>
                </motion.div>
              )}

              <div>
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                  About Me
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Coffee enthusiast and amateur photographer. I spend my
                  weekends exploring hidden gems in the city or getting lost in
                  a good book. Looking for someone who can match my chaotic
                  energy and appreciates a good pasta dish.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Vitals & Lifestyle
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info">
                    <GraduationCap className="w-3 h-3 mr-1 inline" /> NYU
                  </Badge>
                  <Badge variant="default">
                    <Ruler className="w-3 h-3 mr-1 inline" /> 5'6"
                  </Badge>
                  <Badge variant="default">Never smokes</Badge>
                  {!isPreviewPublic && (
                    <Badge variant="warning">Income: $80k-$100k</Badge>
                  )}
                  {!isPreviewPublic && (
                    <Badge variant="warning">Hidden Phone: +1 555...</Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
