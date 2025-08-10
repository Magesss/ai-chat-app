/**
 * 欢迎屏幕组件
 * 
 * 应用的入口页面，展示应用特性和引导用户开始聊天。
 * 使用 React Router 进行导航，提供更好的路由管理。
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageCircle, Zap, Heart } from 'lucide-react';
import { ROUTES } from '../router/routes';

/**
 * 欢迎屏幕组件
 * 
 * 展示应用介绍和特性，引导用户进入聊天界面
 * 
 * @returns React组件
 */
export const WelcomeScreen: React.FC = () => {
  /** 路由导航钩子 */
  const navigate = useNavigate();

  /**
   * 处理开始聊天按钮点击事件
   * 导航到聊天页面
   */
  const handleStartChat = () => {
    navigate(ROUTES.CHAT);
  };

  /** 应用特性列表 */
  const features = [
    {
      icon: MessageCircle,
      title: '智能对话',
      description: '与AI进行自然流畅的对话交流'
    },
    {
      icon: Zap,
      title: '快速响应',
      description: '毫秒级的响应速度，无需等待'
    },
    {
      icon: Sparkles,
      title: '个性化体验',
      description: '根据您的需求提供定制化服务'
    },
    {
      icon: Heart,
      title: '友好界面',
      description: '简洁美观的设计，舒适的使用体验'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        {/* 主标题 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI智能助手
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            体验下一代人工智能对话系统，享受智能、高效、个性化的交流体验
          </p>
        </motion.div>

        {/* 特性展示 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 开始按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            onClick={handleStartChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-3xl transition-all text-lg"
          >
            <MessageCircle className="w-6 h-6" />
            开始对话
          </motion.button>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-gray-500 text-sm mt-4"
          >
            点击开始，体验智能AI助手带来的便捷服务
          </motion.p>
        </motion.div>

        {/* 装饰性元素 */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-50 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-pink-200 rounded-full opacity-50 animate-float" style={{animationDelay: '1s'}}></div>
      </motion.div>
    </div>
  );
};

