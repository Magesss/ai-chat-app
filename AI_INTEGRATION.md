# AI 服务集成指南

## 🔗 集成概述

本项目已成功集成 GraphQL AI 聊天服务，将原有的模拟 AI 响应替换为真实的 DeepSeek AI 服务。

## 🚀 部署的 AI 服务

- **服务名称**: ai-server
- **部署平台**: Cloudflare Workers
- **GraphQL 端点**: https://ai-server.maqingjie646.workers.dev/graphql
- **API 文档**: https://ai-server.maqingjie646.workers.dev/
- **GraphQL Playground**: https://ai-server.maqingjie646.workers.dev/graphql

## 📁 集成的文件

### 新增文件
1. **`src/services/chatService.ts`** - GraphQL AI 聊天服务类
2. **`src/config/api.ts`** - API 配置文件
3. **`src/components/ConnectionStatus.tsx`** - 连接状态指示器

### 修改文件
1. **`src/components/ChatContainer.tsx`** - 主聊天容器，集成真实 AI 服务
2. **`src/components/ChatHeader.tsx`** - 聊天头部，显示连接状态

## 🔧 主要功能

### ChatService 类
- ✅ **GraphQL 查询发送** - 支持超时控制和错误处理
- ✅ **会话管理** - 自动创建和维护聊天会话
- ✅ **AI 对话** - 发送消息给 DeepSeek AI 并获取回复
- ✅ **连接测试** - 验证服务可用性
- ✅ **错误处理** - 详细的错误信息和调试日志

### 前端集成
- ✅ **实时连接状态** - 显示 AI 服务连接状态
- ✅ **自动初始化** - 页面加载时自动测试连接
- ✅ **错误恢复** - 网络错误时的优雅降级
- ✅ **用户体验** - 保持原有的 UI/UX 设计

## 🌐 API 接口

### GraphQL Schema
```graphql
type ChatMessage {
  id: ID!
  role: String!           # 'user' | 'assistant' | 'system'
  content: String!
  timestamp: String!
}

type ChatSession {
  id: ID!
  messages: [ChatMessage!]!
  createdAt: String!
  updatedAt: String!
}

type Query {
  hello: String
  getChatSession(id: ID!): ChatSession
}

type Mutation {
  createChatSession: ChatSession!
  sendMessage(sessionId: ID, message: String!): ChatResponse!
}
```

### 主要操作

#### 1. 测试连接
```typescript
const helloMessage = await chatService.testConnection();
```

#### 2. 发送消息
```typescript
const response = await chatService.sendMessage("你好，请介绍一下自己");
```

#### 3. 创建会话
```typescript
const session = await chatService.createChatSession();
```

## 🔧 配置说明

### API 配置 (`src/config/api.ts`)
```typescript
export const API_CONFIG = {
  GRAPHQL_ENDPOINT: 'https://ai-server.maqingjie646.workers.dev/graphql',
  TIMEOUT: 30000,           // 30秒超时
  MAX_RETRIES: 3,          // 最大重试次数
  RETRY_DELAY: 1000        // 重试延迟
};
```

### 调试配置
```typescript
export const DEBUG_CONFIG = {
  ENABLE_CONSOLE_LOGS: isDevelopment,     // 控制台日志
  ENABLE_NETWORK_LOGS: isDevelopment,     // 网络请求日志
  ENABLE_ERROR_DETAILS: isDevelopment     // 详细错误信息
};
```

## 🛠️ 开发调试

### 启动前端开发服务器
```bash
cd /Users/magesss/Desktop/code/a-project
npm start
```

### 查看网络日志
在开发模式下，打开浏览器控制台查看详细的网络请求和响应日志。

### 测试 AI 服务
1. 访问 [GraphQL Playground](https://ai-server.maqingjie646.workers.dev/graphql)
2. 运行测试查询：
```graphql
query {
  hello
}
```

## 🔍 故障排除

### 常见问题

#### 1. AI 服务连接失败
- 检查网络连接
- 验证 API 端点 URL 是否正确
- 查看浏览器控制台的错误信息

#### 2. GraphQL 查询错误
- 检查查询语法
- 验证变量类型和值
- 查看 GraphQL Playground 进行调试

#### 3. 超时错误
- 检查网络稳定性
- 考虑增加超时时间配置
- 确认 Cloudflare Workers 服务状态

### 调试步骤
1. 打开浏览器开发者工具
2. 查看 Console 标签页的日志
3. 检查 Network 标签页的请求详情
4. 使用 GraphQL Playground 直接测试 API

## 📊 性能优化

### 已实现的优化
- ✅ **请求超时控制** - 避免长时间等待
- ✅ **错误重试机制** - 自动重试失败的请求
- ✅ **会话复用** - 避免重复创建会话
- ✅ **响应缓存** - 前端状态管理

### 未来优化建议
- 🔄 **离线支持** - 本地消息缓存
- 🔄 **实时通信** - WebSocket 连接
- 🔄 **智能重试** - 指数退避重试策略
- 🔄 **请求队列** - 避免并发请求冲突

## 🔒 安全注意事项

1. **API 密钥保护** - DeepSeek API 密钥已在 Cloudflare Workers 中安全存储
2. **CORS 配置** - 服务端已配置适当的跨域访问策略
3. **输入验证** - 前端和后端都进行输入验证
4. **错误处理** - 不暴露敏感的错误信息给用户

## 📞 支持联系

如有问题或需要帮助，请：
1. 检查本文档的故障排除部分
2. 查看 [AI 服务文档](https://ai-server.maqingjie646.workers.dev/)
3. 使用 [GraphQL Playground](https://ai-server.maqingjie646.workers.dev/graphql) 进行调试

---

**集成完成时间**: 2025-08-09  
**AI 服务版本**: v1.0  
**前端框架**: React + TypeScript  
**UI 库**: Tailwind CSS + Framer Motion
