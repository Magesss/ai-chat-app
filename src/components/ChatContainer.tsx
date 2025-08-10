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
import { chatService, convertToFrontendMessage, handleChatError } from '../services/chatService';
import { handleStreamResponse } from '../utils/streamParser';

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
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // 测试连接
        const helloMessage = await chatService.testConnection();
        
        // 显示初始欢迎消息
        const welcomeMessage: Message = {
          id: '1',
          text: '您好！我是您的AI助手。我可以帮助您解答问题、提供建议或者进行愉快的对话。请问有什么我可以为您做的吗？',
          sender: 'ai',
          timestamp: new Date(),
          isTyping: true
        };

        setMessages([welcomeMessage]);
        setIsInitialized(true);
        
        console.log('AI 服务连接成功:', helloMessage);
      } catch (error) {
        console.error('初始化聊天失败:', error);
        
        const errorMessage: Message = {
          id: '1',
          text: '抱歉，AI 服务暂时无法连接。请检查网络连接或稍后再试。',
          sender: 'ai',
          timestamp: new Date()
        };

        setMessages([errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
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
      // 调用真实的 AI 服务
      const response = await chatService.sendMessage(text);

      if (response.success && response.stream) {
        // 创建初始的 AI 消息
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: '',
          sender: 'ai',
          timestamp: new Date(),
          isTyping: true
        };

        // 添加初始消息
        setMessages(prev => [...prev, aiMessage]);

        // 处理流式响应
        await handleStreamResponse(response.stream, {
          onStart: () => {
            console.log('开始接收响应');
          },
          onContent: (content) => {
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage.sender === 'ai') {
                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMessage,
                    text: lastMessage.text + content
                  }
                ];
              }
              return prev;
            });
          },
          onError: (error) => {
            throw new Error(error);
          },
          onEnd: () => {
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage.sender === 'ai') {
                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMessage,
                    isTyping: false
                  }
                ];
              }
              return prev;
            });
          }
        });
      } else {
        // 处理 AI 服务返回的错误
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.error || '抱歉，我无法处理您的请求。请稍后再试。',
          sender: 'ai',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: handleChatError(error),
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

