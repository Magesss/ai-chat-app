/**
 * 应用程序入口文件
 * 
 * 这是 React 应用的入口点，负责：
 * - 初始化 React 应用
 * - 渲染根组件到 DOM
 * - 配置 React.StrictMode 以提高开发体验
 * 
 * 现在应用使用基于 React Router 的路由系统，
 * 所有路由逻辑都已经从这里分离到专门的路由模块中。
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 创建 React 18 的根渲染器
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 渲染应用，启用严格模式以便在开发时检测潜在问题
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

