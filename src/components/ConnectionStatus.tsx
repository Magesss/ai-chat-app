/**
 * 连接状态指示器组件
 * 
 * 显示与 AI 服务的连接状态，包括连接中、已连接和连接失败三种状态。
 * 使用不同的颜色和动画效果来直观地表示当前的连接状态。
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 连接状态组件的属性接口
 */
interface ConnectionStatusProps {
  /** 是否已连接到AI服务 */
  isConnected: boolean;
  /** 是否正在连接中 */
  isLoading: boolean;
}

/**
 * 连接状态指示器组件
 * 
 * @param props 组件属性
 * @returns React组件
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  isLoading 
}) => {
  // 连接中状态：显示蓝色指示器和脉冲动画
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

  // 已连接状态：显示绿色指示器
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

  // 连接失败状态：显示红色指示器
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
