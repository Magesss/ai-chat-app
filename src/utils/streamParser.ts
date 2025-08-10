/**
 * 流式响应解析工具
 * 
 * 提供处理和解析流式响应数据的工具函数。
 */

/**
 * 流式消息类型
 */
export type StreamMessageType = 'start' | 'content' | 'error' | 'end';

/**
 * 流式消息接口
 */
export interface StreamMessage {
  type: StreamMessageType;
  content?: string;
  error?: string;
  timestamp?: string;
}

/**
 * 解析流式响应数据
 * 
 * @param chunk 接收到的数据块
 * @returns 解析后的消息数组
 */
export function parseStreamChunk(chunk: string): StreamMessage[] {
  const messages: StreamMessage[] = [];
  const lines = chunk.split('\n').filter(Boolean);

  for (const line of lines) {
    try {
      const data = JSON.parse(line);
      if (isValidStreamMessage(data)) {
        messages.push(data);
      }
    } catch (e) {
      console.warn('解析流式数据失败:', e);
    }
  }

  return messages;
}

/**
 * 验证消息格式是否有效
 * 
 * @param data 要验证的数据
 * @returns 是否是有效的流式消息
 */
function isValidStreamMessage(data: any): data is StreamMessage {
  if (!data || typeof data !== 'object') return false;
  if (!data.type || typeof data.type !== 'string') return false;
  
  const validTypes: StreamMessageType[] = ['start', 'content', 'error', 'end'];
  if (!validTypes.includes(data.type as StreamMessageType)) return false;

  switch (data.type) {
    case 'content':
      return typeof data.content === 'string';
    case 'error':
      return typeof data.error === 'string';
    case 'start':
    case 'end':
      return typeof data.timestamp === 'string';
    default:
      return false;
  }
}

/**
 * 处理流式响应
 * 
 * @param stream 可读流
 * @param handlers 消息处理器
 */
export async function handleStreamResponse(
  stream: ReadableStream<string>,
  handlers: {
    onStart?: () => void;
    onContent: (content: string) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
  }
): Promise<void> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const messages = parseStreamChunk(chunk);

      for (const message of messages) {
        switch (message.type) {
          case 'start':
            handlers.onStart?.();
            break;
          case 'content':
            if (message.content) {
              handlers.onContent(message.content);
            }
            break;
          case 'error':
            if (message.error) {
              handlers.onError?.(message.error);
            }
            break;
          case 'end':
            handlers.onEnd?.();
            break;
        }
      }
    }
  } catch (error) {
    console.error('处理流式响应错误:', error);
    handlers.onError?.(error instanceof Error ? error.message : '处理响应时发生未知错误');
  } finally {
    reader.releaseLock();
  }
}
