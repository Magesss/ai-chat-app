/**
 * 路由模块统一导出文件
 * 
 * 将所有路由相关的组件、常量和工具函数统一导出，
 * 便于其他模块导入和使用。
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

// 导出路由组件
export { AppRouter } from './AppRouter';
export { default as Router } from './AppRouter';

// 导出路由常量和工具函数
export { 
  ROUTES, 
  getRoutePath, 
  isRouteActive,
  type RouteKeys,
  type RoutePaths 
} from './routes';
