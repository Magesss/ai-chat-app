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
    this.graphqlEndpoint = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:4113/graphql' 
      : 'https://hello-mastra.maqingjie646.workers.dev/graphql';
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public async askWeather(message: string): Promise<WeatherMessage> {
    try {
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
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }


}

export const weatherService = WeatherService.getInstance();
