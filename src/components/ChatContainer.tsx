import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { LoadingIndicator } from './LoadingIndicator';
import { chatService, convertToFrontendMessage, handleChatError } from '../services/chatService';

export const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 初始化组件时测试连接并显示欢迎消息
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!isInitialized) {
      console.warn('聊天服务尚未初始化');
      return;
    }

    // 添加用户消息
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

      if (response.success && response.message) {
        // 转换并添加 AI 回复
        const aiMessage = convertToFrontendMessage(response.message);
        aiMessage.isTyping = true; // 添加打字动画效果
        
        setMessages(prev => [...prev, aiMessage]);
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

