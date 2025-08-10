// import { API_CONFIG } from '../config/api'; // 暂时不使用

export interface WeatherMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface WeatherResponse {
  success: boolean;
  message: WeatherMessage | null;
  error: string | null;
}

class WeatherService {
  private static instance: WeatherService;
  private apiEndpoint: string;

  private constructor() {
    // 使用新的RESTful API
    this.apiEndpoint = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:4123/api' 
      : 'https://hello-mastra.maqingjie646.workers.dev/api'; // 生产环境API地址
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public async askWeather(message: string): Promise<WeatherMessage> {
    try {
      // 使用Mastra的标准Agent API
      const response = await fetch(`${this.apiEndpoint}/agents/weatherAgent/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: message }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 将Mastra API响应转换为WeatherMessage格式
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.text || data.content || '抱歉，无法获取天气信息',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }
}

export const weatherService = WeatherService.getInstance();
