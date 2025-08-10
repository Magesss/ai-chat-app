/**
 * 应用主组件
 * 
 * 这是应用的根组件，现在主要负责渲染路由系统。
 * 所有的路由逻辑都已经移到了独立的 AppRouter 组件中，
 * 提供更好的代码组织和维护性。
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

import React from 'react';
import { AppRouter } from './router';

/**
 * 应用主组件
 * 
 * 渲染路由系统，管理整个应用的页面导航
 * 
 * @returns React应用根组件
 */
function App() {
  return <AppRouter />;
}

export default App;

