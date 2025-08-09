import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { LoadingIndicator } from './LoadingIndicator';
import { getRandomAIResponse, simulateAIDelay } from '../utils/aiResponses';

export const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '您好！我是您的AI助手。我可以帮助您解答问题、提供建议或者进行愉快的对话。请问有什么我可以为您做的吗？',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
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
      // 模拟AI思考延迟
      await simulateAIDelay();

      // 生成AI回复
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomAIResponse(),
        sender: 'ai',
        timestamp: new Date(),
        isTyping: true
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，我现在遇到了一些技术问题。请稍后再试。',
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
      <ChatHeader />

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

