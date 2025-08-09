import React from 'react';
import { motion } from 'framer-motion';

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-3 mb-6">
      {/* AI头像 */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
        />
      </div>

      {/* 加载气泡 */}
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-6 py-4 shadow-lg relative">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">AI正在思考</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* 气泡尾巴 */}
        <div className="absolute left-[-6px] top-3 w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45" />
      </div>
    </div>
  );
};

