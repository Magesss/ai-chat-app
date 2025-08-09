// GraphQL AI 聊天服务
import { API_CONFIG, DEBUG_CONFIG } from '../config/api';

const GRAPHQL_ENDPOINT = API_CONFIG.GRAPHQL_ENDPOINT;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatResponse {
  success: boolean;
  message: ChatMessage | null;
  session: ChatSession | null;
  error: string | null;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

class ChatService {
  private sessionId: string | null = null;

  /**
   * 发送 GraphQL 查询
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
   */
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * 重置会话
   */
  resetSession(): void {
    this.sessionId = null;
  }
}

// 导出单例实例
export const chatService = new ChatService();

// 工具函数：将服务响应转换为前端消息格式
export const convertToFrontendMessage = (chatMessage: ChatMessage): any => {
  return {
    id: chatMessage.id,
    text: chatMessage.content,
    sender: chatMessage.role === 'user' ? 'user' : 'ai',
    timestamp: new Date(chatMessage.timestamp)
  };
};

// 错误处理工具
export const handleChatError = (error: any): string => {
  if (error?.message) {
    return `AI 服务错误: ${error.message}`;
  }
  
  if (typeof error === 'string') {
    return `连接错误: ${error}`;
  }
  
  return '抱歉，AI 服务暂时不可用。请稍后再试。';
};
