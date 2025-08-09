import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Settings, MoreVertical } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';

interface ChatHeaderProps {
  isConnected?: boolean;
  isLoading?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  isConnected = true, 
  isLoading = false 
}) => {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between"
    >
      {/* AI信息 */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Bot className="w-6 h-6 text-white" />
        </motion.div>
        
        <div>
          <h1 className="text-lg font-semibold text-gray-900">AI助手</h1>
          <ConnectionStatus isConnected={isConnected} isLoading={isLoading} />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>
    </motion.header>
  );
};

