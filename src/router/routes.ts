/**
 * 路由常量定义文件
 * 
 * 集中管理应用中所有的路由路径常量，便于：
 * - 统一管理路由路径
 * - 避免硬编码路径错误
 * - 提供类型安全的路由导航
 * - 便于路由重构和维护
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

/**
 * 应用路由路径常量
 * 
 * 定义所有页面的路由路径，使用常量避免拼写错误
 */
export const ROUTES = {
  /** 欢迎页面 - 应用入口 */
  HOME: '/',
  
  /** 聊天界面 - 主要功能页面 */
  CHAT: '/chat',
  
  /** 设置页面 - 预留给未来功能 */
  SETTINGS: '/settings',
  
  /** 聊天历史页面 - 预留给未来功能 */
  HISTORY: '/history',
} as const;

/**
 * 路由类型定义
 * 从 ROUTES 对象中提取类型，确保类型安全
 */
export type RouteKeys = keyof typeof ROUTES;
export type RoutePaths = typeof ROUTES[RouteKeys];

/**
 * 路由导航工具函数
 * 
 * 提供类型安全的路由导航方法，可以与 React Router 的 useNavigate 结合使用
 * 
 * @param path 路由路径
 * @returns 验证过的路由路径
 */
export const getRoutePath = (path: RoutePaths): string => {
  return path;
};

/**
 * 路由匹配工具函数
 * 
 * 检查当前路径是否匹配指定路由
 * 
 * @param currentPath 当前路径
 * @param targetPath 目标路径
 * @returns 是否匹配
 */
export const isRouteActive = (currentPath: string, targetPath: RoutePaths): boolean => {
  return currentPath === targetPath;
};
