/**
 * 聊天容器组件
 * 
 * 这是聊天应用的核心组件，负责管理整个聊天界面的状态和交互。
 * 包括消息显示、用户输入处理、AI服务连接管理等功能。
 * 
 * 主要功能：
 * - 初始化AI服务连接
 * - 管理聊天消息列表
 * - 处理用户消息发送
 * - 显示AI回复
 * - 错误处理和状态管理
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { LoadingIndicator } from './LoadingIndicator';
import { weatherService } from '../services/weatherService';


/**
 * 聊天容器组件
 * 
 * @returns React组件
 */
export const ChatContainer: React.FC = () => {
  /** 聊天消息列表 */
  const [messages, setMessages] = useState<Message[]>([]);
  
  /** 是否正在加载AI回复 */
  const [isLoading, setIsLoading] = useState(false);
  
  /** AI服务是否已初始化连接 */
  const [isInitialized, setIsInitialized] = useState(false);
  
  /** 消息列表底部的引用，用于自动滚动 */
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * 滚动到消息列表底部
   * 在新消息到达时自动滚动，确保用户始终看到最新消息
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * 组件初始化副作用
   * 在组件挂载时测试AI服务连接并显示欢迎消息
   */
  useEffect(() => {
    // 显示初始欢迎消息
    const welcomeMessage: Message = {
      id: '1',
      text: '您好！我是天气助手。我可以帮您查询任何地方的天气情况。请告诉我您想查询哪里的天气？',
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    setIsInitialized(true);
    setIsLoading(false);
  }, []);

  /**
   * 消息变化时的副作用
   * 当消息列表更新时自动滚动到底部
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * 处理用户发送消息
   * 
   * 将用户输入的消息发送给AI服务，并处理回复。
   * 包含完整的错误处理和状态管理。
   * 
   * @param text 用户输入的消息文本
   */
  const handleSendMessage = async (text: string) => {
    // 检查服务是否已初始化
    if (!isInitialized) {
      console.warn('聊天服务尚未初始化');
      return;
    }

    // 创建并添加用户消息到消息列表
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 调用天气服务
      const response = await weatherService.askWeather(text);
      
      // 创建 AI 消息
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: response.content,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，我暂时无法回答您的问题。请稍后再试。',
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 聊天头部 */}
      <ChatHeader isConnected={isInitialized} isLoading={isLoading && !isInitialized} />

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              index={index}
            />
          ))}

          {/* 加载指示器 */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingIndicator />
            </motion.div>
          )}

          {/* 滚动锚点 */}
          <div ref={messagesEndRef} />
        </motion.div>
      </div>

      {/* 输入框 */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

