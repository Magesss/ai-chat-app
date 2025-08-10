import { API_CONFIG } from '../config/api';

export interface WeatherMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp?: string;
}

class WeatherService {
  private static instance: WeatherService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = API_CONFIG.MASTRA_ENDPOINT;
  }

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  public async askWeather(message: string): Promise<WeatherMessage> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/weather-agent/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.content,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  }

  public async streamWeather(
    message: string,
    onChunk: (chunk: string) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/weather-agent/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is null');
      }

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          onComplete();
          break;
        }
        const chunk = decoder.decode(value);
        onChunk(chunk);
      }
    } catch (error) {
      console.error('Error streaming weather:', error);
      onError(error as Error);
    }
  }
}

export const weatherService = WeatherService.getInstance();
