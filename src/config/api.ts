// API 配置文件
export const API_CONFIG = {
  // GraphQL AI 聊天服务端点
  GRAPHQL_ENDPOINT: 'https://ai-server.maqingjie646.workers.dev/graphql',
  
  // API 文档地址
  DOCS_URL: 'https://ai-server.maqingjie646.workers.dev/',
  
  // GraphQL Playground 地址
  PLAYGROUND_URL: 'https://ai-server.maqingjie646.workers.dev/graphql',
  
  // 请求超时时间（毫秒）
  TIMEOUT: 30000,
  
  // 重试次数
  MAX_RETRIES: 3,
  
  // 重试延迟（毫秒）
  RETRY_DELAY: 1000
};

// 环境配置
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// 调试配置
export const DEBUG_CONFIG = {
  ENABLE_CONSOLE_LOGS: isDevelopment,
  ENABLE_NETWORK_LOGS: isDevelopment,
  ENABLE_ERROR_DETAILS: isDevelopment
};
