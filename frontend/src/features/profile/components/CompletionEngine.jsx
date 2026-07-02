import React from "react";
import { Card } from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";
import { CheckCircle2, Circle, Trophy, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

export const CompletionEngine = () => {
  const completionPercentage = 75;

  const tasks = [
    { title: "Upload a primary photo", completed: true, points: 20 },
    { title: "Write an engaging bio", completed: true, points: 25 },
    { title: "Add your location", completed: true, points: 10 },
    { title: "Verify your profile with photo", completed: false, points: 40 },
    { title: "Connect Spotify account", completed: false, points: 15 },
  ];

  return (
    <Card className="max-w-md w-full mx-auto relative overflow-hidden bg-gray-900 border-gray-800 p-0">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4">
        <Trophy className="w-40 h-40 text-blue-500" />
      </div>

      <div className="p-6 relative z-10 border-b border-gray-800/50 bg-gradient-to-br from-blue-900/10 to-transparent">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              Profile Strength <Zap className="w-5 h-5 text-yellow-400" />
            </h3>
            <p className="text-sm text-gray-400">
              Stand out and get more matches.
            </p>
          </div>
          <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500">
            {completionPercentage}%
          </span>
        </div>

        <div className="w-full h-3 bg-gray-950 rounded-full overflow-hidden shadow-inner border border-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 relative"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="absolute top-0 left-0 bottom-0 right-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg==')] opacity-50" />
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-3 bg-gray-950/30">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
          Next Steps
        </h4>
        {tasks.map((task, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              task.completed
                ? "bg-gray-900/40 border-gray-800 opacity-60"
                : "bg-gray-800/60 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800 cursor-pointer shadow-lg group"
            }`}
          >
            <div className="flex items-center gap-3">
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
              )}
              <span
                className={`text-sm font-medium ${task.completed ? "text-gray-500 line-through" : "text-gray-200"}`}
              >
                {task.title}
              </span>
            </div>
            {!task.completed && (
              <div className="flex items-center gap-3">
                <Badge
                  variant="info"
                  className="bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                >
                  +{task.points}
                </Badge>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Card>
  );
};
