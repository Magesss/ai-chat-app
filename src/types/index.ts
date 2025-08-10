/**
 * 应用程序类型定义文件
 * 
 * 定义整个聊天应用中使用的核心数据类型和接口。
 * 这些类型确保了组件之间数据传递的类型安全。
 * 
 * @author AI Chat App
 * @version 1.0
 * @since 2025-08-09
 */

/**
 * 聊天消息接口
 * 
 * 定义前端组件中使用的消息数据结构。
 * 注意：这与后端API中的ChatMessage格式略有不同。
 */
export interface Message {
  /** 消息的唯一标识符 */
  id: string;
  
  /** 消息内容文本 */
  text: string;
  
  /** 消息发送者：用户或AI */
  sender: 'user' | 'ai';
  
  /** 消息创建的时间戳 */
  timestamp: Date;
  
  /** 可选：是否显示打字动画效果（仅用于AI消息） */
  isTyping?: boolean;
}

/**
 * 聊天状态接口
 * 
 * 定义聊天组件的整体状态结构。
 * 目前主要用于类型定义，实际状态管理在组件内部进行。
 */
export interface ChatState {
  /** 所有聊天消息的列表 */
  messages: Message[];
  
  /** 是否正在等待AI回复 */
  isLoading: boolean;
  
  /** 当前输入框的值 */
  inputValue: string;
}

