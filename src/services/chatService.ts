/**
 * GraphQL AI 聊天服务
 * 
 * 该服务负责与部署在 Cloudflare Workers 上的 GraphQL AI 后端进行通信，
 * 提供完整的聊天会话管理和 AI 对话功能。
 * 
 * 主要功能：
 * - 会话创建和管理
 * - 消息发送和接收
 * - 错误处理和重试机制
 * - 连接状态监控
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

import { API_CONFIG, DEBUG_CONFIG } from '../config/api';

// GraphQL 服务端点
const GRAPHQL_ENDPOINT = API_CONFIG.GRAPHQL_ENDPOINT;

/**
 * 聊天消息接口
 * 定义单个聊天消息的数据结构
 */
export interface ChatMessage {
  /** 消息唯一标识符 */
  id: string;
  /** 消息发送者角色：用户、AI助手或系统 */
  role: 'user' | 'assistant' | 'system';
  /** 消息内容 */
  content: string;
  /** 消息创建时间戳 */
  timestamp: string;
}

/**
 * 聊天会话接口
 * 定义完整聊天会话的数据结构
 */
export interface ChatSession {
  /** 会话唯一标识符 */
  id: string;
  /** 会话中的所有消息 */
  messages: ChatMessage[];
  /** 会话创建时间 */
  createdAt: string;
  /** 会话最后更新时间 */
  updatedAt: string;
}

/**
 * 聊天响应接口
 * 定义 AI 服务响应的数据结构
 */
export interface ChatResponse {
  /** 操作是否成功 */
  success: boolean;
  /** AI 回复的消息（如果成功且不是流式响应） */
  message?: ChatMessage | null;
  /** 流式响应（如果是流式响应） */
  stream?: ReadableStream<string>;
  /** 更新后的会话信息（如果成功） */
  session: ChatSession | null;
  /** 错误信息（如果失败） */
  error: string | null;
}

/**
 * GraphQL 响应接口
 * 定义标准的 GraphQL 响应格式
 */
export interface GraphQLResponse<T> {
  /** 响应数据 */
  data?: T;
  /** 错误信息数组 */
  errors?: Array<{ message: string }>;
}

/**
 * 聊天服务类
 * 
 * 提供与 GraphQL AI 后端通信的核心功能，包括会话管理、
 * 消息发送、错误处理等。该类采用单例模式，确保整个应用
 * 中只有一个聊天服务实例。
 */
class ChatService {
  /** 当前聊天会话的 ID，null 表示尚未创建会话 */
  private sessionId: string | null = null;

  /**
   * 发送 GraphQL 查询
   * 
   * 封装了完整的 GraphQL 请求逻辑，包括：
   * - 请求超时控制
   * - 错误处理和分类
   * - 调试日志输出
   * - 响应数据验证
   * 
   * @param query GraphQL 查询字符串
   * @param variables 查询变量（可选）
   * @returns Promise<T> 返回解析后的响应数据
   * @throws Error 当请求失败或响应无效时抛出错误
   */
  private async sendGraphQLQuery<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const requestBody = {
      query,
      variables
    };

    if (DEBUG_CONFIG.ENABLE_NETWORK_LOGS) {
      console.log('🚀 发送 GraphQL 请求:', {
        endpoint: GRAPHQL_ENDPOINT,
        body: requestBody
      });
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (DEBUG_CONFIG.ENABLE_NETWORK_LOGS) {
        console.log('✅ GraphQL 响应:', result);
      }

      if (result.errors && result.errors.length > 0) {
        const errorMessage = result.errors.map(e => e.message).join(', ');
        throw new Error(`GraphQL Error: ${errorMessage}`);
      }

      if (!result.data) {
        throw new Error('No data received from server');
      }

      return result.data;
    } catch (error) {
      if (DEBUG_CONFIG.ENABLE_ERROR_DETAILS) {
        console.error('❌ GraphQL 查询失败:', {
          endpoint: GRAPHQL_ENDPOINT,
          query,
          variables,
          error
        });
      }

      // 处理不同类型的错误
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('请求超时，请检查网络连接');
        }
        throw error;
      }

      throw new Error('未知网络错误');
    }
  }

  /**
   * 创建新的聊天会话
   * 
   * 向服务器发送请求创建一个新的聊天会话，并保存会话ID
   * 以便后续消息可以关联到同一个会话中。
   * 
   * @returns Promise<ChatSession> 新创建的聊天会话信息
   * @throws Error 当会话创建失败时抛出错误
   */
  async createChatSession(): Promise<ChatSession> {
    const query = `
      mutation {
        createChatSession {
          id
          messages {
            id
            role
            content
            timestamp
          }
          createdAt
          updatedAt
        }
      }
    `;

    const result = await this.sendGraphQLQuery<{ createChatSession: ChatSession }>(query);
    this.sessionId = result.createChatSession.id;
    return result.createChatSession;
  }

  /**
   * 发送消息给 AI
   * 
   * 向 AI 服务发送用户消息并获取回复。如果当前没有活跃的会话，
   * 会自动创建一个新会话。该方法会维护完整的对话上下文。
   * 
   * @param message 用户输入的消息内容
   * @returns Promise<ChatResponse> AI 的回复和更新后的会话信息
   * @throws Error 当消息发送失败时抛出错误
   */
  async sendMessage(message: string): Promise<ChatResponse> {
    // 如果没有会话ID，先创建会话
    if (!this.sessionId) {
      await this.createChatSession();
    }

    const query = `
      mutation SendMessage($message: String!, $sessionId: ID) {
        sendMessage(message: $message, sessionId: $sessionId) {
          success
          error
          stream
          message {
            id
            role
            content
            timestamp
          }
          session {
            id
            messages {
              id
              role
              content
              timestamp
            }
            createdAt
            updatedAt
          }
        }
      }
    `;

    const variables = {
      message,
      sessionId: this.sessionId
    };

    const result = await this.sendGraphQLQuery<{ sendMessage: ChatResponse }>(query, variables);
    return result.sendMessage;
  }

  /**
   * 获取聊天会话
   * 
   * 根据会话ID获取完整的聊天会话信息，包括所有的消息历史。
   * 
   * @param sessionId 要获取的会话ID
   * @returns Promise<ChatSession | null> 会话信息，如果会话不存在则返回null
   * @throws Error 当请求失败时抛出错误
   */
  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    const query = `
      query GetChatSession($id: ID!) {
        getChatSession(id: $id) {
          id
          messages {
            id
            role
            content
            timestamp
          }
          createdAt
          updatedAt
        }
      }
    `;

    const variables = { id: sessionId };
    const result = await this.sendGraphQLQuery<{ getChatSession: ChatSession | null }>(query, variables);
    return result.getChatSession;
  }

  /**
   * 测试连接
   * 
   * 发送简单的测试查询以验证与 AI 服务的连接是否正常。
   * 通常在应用启动时调用以检查服务可用性。
   * 
   * @returns Promise<string> 服务器返回的问候消息
   * @throws Error 当连接失败时抛出错误
   */
  async testConnection(): Promise<string> {
    const query = `
      query {
        hello
      }
    `;

    const result = await this.sendGraphQLQuery<{ hello: string }>(query);
    return result.hello;
  }

  /**
   * 获取当前会话ID
   * 
   * 返回当前活跃会话的ID，如果还没有创建会话则返回null。
   * 
   * @returns string | null 当前会话ID或null
   */
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * 重置会话
   * 
   * 清除当前会话ID，下次发送消息时会自动创建新的会话。
   * 通常在用户想要开始全新对话时调用。
   */
  resetSession(): void {
    this.sessionId = null;
  }
}

/**
 * 聊天服务单例实例
 * 
 * 整个应用中共享的聊天服务实例，确保会话状态的一致性。
 * 所有组件都应该使用这个实例来进行 AI 对话。
 */
export const chatService = new ChatService();

/**
 * 工具函数：将服务响应转换为前端消息格式
 * 
 * 将后端返回的 ChatMessage 格式转换为前端组件期望的格式。
 * 主要是将 content 字段映射为 text，role 字段转换为 sender。
 * 
 * @param chatMessage 后端返回的聊天消息对象
 * @returns 前端组件期望的消息格式
 */
export const convertToFrontendMessage = (chatMessage: ChatMessage): any => {
  return {
    id: chatMessage.id,
    text: chatMessage.content,
    sender: chatMessage.role === 'user' ? 'user' : 'ai',
    timestamp: new Date(chatMessage.timestamp)
  };
};

/**
 * 错误处理工具函数
 * 
 * 将各种类型的错误转换为用户友好的错误信息。
 * 在开发环境中会保留详细错误信息，生产环境中显示通用提示。
 * 
 * @param error 捕获到的错误对象
 * @returns 用户友好的错误信息字符串
 */
export const handleChatError = (error: any): string => {
  // 处理包含错误消息的Error对象
  if (error?.message) {
    return `AI 服务错误: ${error.message}`;
  }
  
  // 处理字符串类型的错误
  if (typeof error === 'string') {
    return `连接错误: ${error}`;
  }
  
  // 默认错误信息
  return '抱歉，AI 服务暂时不可用。请稍后再试。';
};
