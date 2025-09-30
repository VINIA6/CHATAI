import React from 'react';
import { motion } from 'framer-motion';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 px-4 py-3">
      <motion.div
        className="w-2 h-2 bg-emerald-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.div
        className="w-2 h-2 bg-emerald-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-2 h-2 bg-emerald-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </div>
  );
};
