import React from 'react';
import { motion } from 'framer-motion';

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
      >
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span>连接 AI 服务中...</span>
      </motion.div>
    );
  }

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>AI 服务已连接</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-200"
    >
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      <span>AI 服务连接失败</span>
    </motion.div>
  );
};
