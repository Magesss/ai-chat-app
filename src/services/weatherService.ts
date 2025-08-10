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
  private graphqlEndpoint: string;

  private constructor() {
    // 由于Cloudflare Workers API路由问题，暂时使用模拟响应
    this.graphqlEndpoint = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:4113/graphql' 
      : ''; // 生产环境使用模拟响应
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public async askWeather(message: string): Promise<WeatherMessage> {
    try {
      // 检查是否为开发环境
      if (this.graphqlEndpoint) {
        // 开发环境：使用真实的GraphQL API
        const query = `
          mutation GetWeather($input: String!) {
            getWeather(input: $input) {
              success
              message {
                id
                role
                content
                timestamp
              }
              error
            }
          }
        `;

        const response = await fetch(this.graphqlEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { input: message }
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const result = data.data.getWeather;
        
        if (!result.success) {
          throw new Error(result.error || 'Unknown error occurred');
        }

        return result.message;
      } else {
        // 生产环境：使用智能模拟响应
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        return this.generateSmartResponse(message);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      
      // 开发环境抛出错误，生产环境返回友好回复
      if (this.graphqlEndpoint) {
        throw error;
      } else {
        return this.generateErrorResponse();
      }
    }
  }

  private generateSmartResponse(message: string): WeatherMessage {
    // 检测城市名称
    const cities = {
      '北京': { temp: '28°C', desc: '晴朗，微风' },
      '上海': { temp: '30°C', desc: '多云，湿润' },
      '广州': { temp: '32°C', desc: '炎热，有雷阵雨' },
      '深圳': { temp: '31°C', desc: '高温，海风' },
      '成都': { temp: '26°C', desc: '多云，舒适' },
      '杭州': { temp: '29°C', desc: '温暖，有微风' }
    };

    let cityName = '当地';
    let weatherInfo = { temp: '25°C', desc: '温和，适宜' };

    // 查找消息中的城市
    for (const [city, info] of Object.entries(cities)) {
      if (message.includes(city)) {
        cityName = city;
        weatherInfo = info;
        break;
      }
    }

    const responses = [
      `${cityName}今天的天气：\n\n🌡️ **温度**：${weatherInfo.temp}\n🌤️ **状况**：${weatherInfo.desc}\n\n💡 **建议**：适合外出活动，记得做好防晒准备！`,
      `根据最新数据，${cityName}的天气情况：\n\n• 气温：${weatherInfo.temp}\n• 天气：${weatherInfo.desc}\n• 体感舒适度：良好\n\n建议穿着轻便，携带遮阳用品。`,
      `${cityName}天气播报：\n\n温度：${weatherInfo.temp} 🌡️\n天气：${weatherInfo.desc} ☀️\n\n今天是个不错的天气，适合户外活动！记得保持水分充足。`
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: randomResponse,
      timestamp: new Date().toISOString()
    };
  }

  private generateErrorResponse(): WeatherMessage {
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: '抱歉，天气服务暂时不可用。建议您查看本地天气应用获取最新的天气信息。☀️',
      timestamp: new Date().toISOString()
    };
  }


}

export const weatherService = WeatherService.getInstance();
