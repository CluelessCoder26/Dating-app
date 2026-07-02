import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Heart, MessageCircle } from "lucide-react";

export const MomentsGrid = () => {
  const [moments, setMoments] = useState([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=500&fit=crop",
      likes: 124,
      comments: 12,
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop",
      likes: 89,
      comments: 4,
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
      likes: 256,
      comments: 24,
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=500&h=500&fit=crop",
      likes: 45,
      comments: 1,
    },
  ]);

  const handleAddMoment = () => {
    // In a real app, this would open a file picker or camera
    const newMoment = {
      id: Date.now().toString(),
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
      likes: 0,
      comments: 0,
    };
    setMoments([newMoment, ...moments]);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Moments</h2>
        <span className="text-sm text-gray-400">{moments.length} posts</span>
      </div>

      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {/* Upload Button Cell */}
        <motion.div
          whileHover={{ scale: 0.98 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddMoment}
          className="aspect-square bg-gray-900 border border-dashed border-gray-700 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-gray-800 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
            <Plus className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-xs text-gray-400 font-medium hidden sm:block">
            Add Moment
          </span>
        </motion.div>

        {/* Moments Cells */}
        {moments.map((moment, index) => (
          <motion.div
            key={moment.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="aspect-square relative group overflow-hidden rounded-md bg-gray-900 cursor-pointer"
          >
            <img
              src={moment.url}
              alt="Moment"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
              <div className="flex items-center text-white gap-1">
                <Heart className="w-5 h-5 fill-white" />
                <span className="font-bold">{moment.likes}</span>
              </div>
              <div className="flex items-center text-white gap-1">
                <MessageCircle className="w-5 h-5 fill-white" />
                <span className="font-bold">{moment.comments}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
