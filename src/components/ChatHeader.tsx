/**
 * 聊天页面头部组件
 * 
 * 显示AI助手信息、连接状态和操作按钮。
 * 包含返回按钮，允许用户返回欢迎页面。
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Settings, MoreVertical, ArrowLeft } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';
import { ROUTES } from '../router/routes';

/**
 * 聊天头部组件属性接口
 */
interface ChatHeaderProps {
  /** 是否已连接到AI服务 */
  isConnected?: boolean;
  /** 是否正在连接中 */
  isLoading?: boolean;
}

/**
 * 聊天头部组件
 * 
 * @param props 组件属性
 * @returns React组件
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  isConnected = true, 
  isLoading = false 
}) => {
  /** 路由导航钩子 */
  const navigate = useNavigate();

  /**
   * 处理返回按钮点击事件
   * 导航回欢迎页面
   */
  const handleGoBack = () => {
    navigate(ROUTES.HOME);
  };
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between"
    >
      {/* 左侧：返回按钮和AI信息 */}
      <div className="flex items-center gap-3">
        {/* 返回按钮 */}
        <motion.button
          onClick={handleGoBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors mr-2"
          title="返回首页"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </motion.button>
        
        {/* AI头像和信息 */}
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

      {/* 右侧：操作按钮 */}
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

