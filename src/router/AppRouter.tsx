/**
 * 应用路由配置组件
 * 
 * 这个组件负责定义整个应用的路由结构，包括：
 * - 欢迎页面路由
 * - 聊天界面路由
 * - 未来可能的其他路由（如设置、历史记录等）
 * 
 * 使用 React Router 来管理单页应用的路由切换，
 * 提供更好的用户体验和页面管理。
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { ChatContainer } from '../components/ChatContainer';

/**
 * 应用主路由组件
 * 
 * 定义所有的路由规则和对应的组件。
 * 使用 BrowserRouter 提供现代化的路由体验。
 * 
 * @returns React路由组件
 */
export const AppRouter: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 欢迎页面路由 - 应用入口 */}
          <Route 
            path="/" 
            element={<WelcomeScreen />} 
          />
          
          {/* 聊天界面路由 - 主要功能页面 */}
          <Route 
            path="/chat" 
            element={<ChatContainer />} 
          />
          
          {/* 默认重定向到欢迎页面 */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
