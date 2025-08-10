/**
 * API 配置文件
 * 
 * 集中管理应用中所有与 API 相关的配置，包括端点URL、
 * 超时时间、重试策略等。修改这个文件可以轻松切换
 * 不同的服务端点或调整网络参数。
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

/**
 * API 配置对象
 * 包含所有与 AI 服务通信相关的配置项
 */
export const API_CONFIG = {
  /** GraphQL AI 聊天服务的主要端点 */
  GRAPHQL_ENDPOINT: 'https://ai-server.maqingjie646.workers.dev/graphql',
  
  /** API 文档页面地址 */
  DOCS_URL: 'https://ai-server.maqingjie646.workers.dev/',
  
  /** GraphQL Playground 交互式查询界面地址 */
  PLAYGROUND_URL: 'https://ai-server.maqingjie646.workers.dev/graphql',

  /** Mastra 天气服务端点 */
  MASTRA_ENDPOINT: process.env.NODE_ENV === 'development' ? 'http://localhost:4112/api' : 'https://hello-mastra.maqingjie646.workers.dev',
  
  /** 网络请求超时时间（毫秒）- 30秒 */
  TIMEOUT: 30000,
  
  /** 请求失败时的最大重试次数 */
  MAX_RETRIES: 3,
  
  /** 重试之间的延迟时间（毫秒） */
  RETRY_DELAY: 1000
};

/**
 * 环境检测
 * 用于判断当前运行环境，以便启用不同的功能
 */
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * 调试配置
 * 控制开发和生产环境中的调试功能开关
 */
export const DEBUG_CONFIG = {
  /** 是否启用控制台日志输出 */
  ENABLE_CONSOLE_LOGS: isDevelopment,
  
  /** 是否启用详细的网络请求日志 */
  ENABLE_NETWORK_LOGS: isDevelopment,
  
  /** 是否在错误信息中包含详细的技术细节 */
  ENABLE_ERROR_DETAILS: isDevelopment
};
