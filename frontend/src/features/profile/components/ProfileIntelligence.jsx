import React from "react";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import {
  Sparkles,
  BrainCircuit,
  ThumbsUp,
  AlertTriangle,
  ArrowRight,
  MessageSquareHeart,
} from "lucide-react";
import { motion } from "framer-motion";

export const ProfileIntelligence = () => {
  return (
    <Card
      glow
      className="max-w-md w-full mx-auto border-purple-500/30 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <div className="flex items-center gap-4 mb-6 border-b border-gray-800/50 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center shadow-inner">
          <BrainCircuit className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            AI Profile Review <Sparkles className="w-4 h-4 text-yellow-400" />
          </h2>
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-1">
            Antigravity Intelligence
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/60 border border-green-500/30 rounded-2xl p-4 flex gap-4 shadow-[0_0_15px_rgba(34,197,94,0.05)]"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <ThumbsUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                Engaging Bio Setup
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your bio perfectly balances humor and intent. Profiles with this
                structure receive <strong>40% more inbound messages</strong>.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/60 border border-yellow-500/30 rounded-2xl p-4 flex gap-4 shadow-[0_0_15px_rgba(234,179,8,0.05)]"
          >
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                Photo Variety Needed
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                You only have selfies. Adding a full-body or action shot can
                increase your match rate by up to 3x.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-800/50">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquareHeart className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-bold text-purple-400">
              AI Rewrite Suggestion
            </h4>
          </div>

          <div className="bg-gray-950 rounded-xl p-4 border border-gray-800 mb-4 relative">
            <div className="absolute -left-1 top-4 bottom-4 w-1 bg-purple-500 rounded-r-md" />
            <p className="text-sm text-gray-300 italic">
              "Software engineer by day, amateur chef by night. Looking for
              someone to explore hidden food spots in the city and argue about
              the best pizza place."
            </p>
          </div>

          <Button
            variant="primary"
            className="w-full shadow-lg shadow-purple-500/20 bg-gradient-to-r from-blue-600 to-purple-600 border-0"
          >
            Apply Suggestion <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
