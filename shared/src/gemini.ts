import { GoogleGenAI } from "@google/genai";

export type GeminiModel = "gemini-2.5-pro" | "gemini-2.5-flash";

export interface GeminiConfig {
  apiKey: string;
  model?: GeminiModel;
  maxRetries?: number;
  retryDelay?: number;
}

export class GeminiService {
  private ai: GoogleGenAI;
  private model: GeminiModel;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: GeminiConfig) {
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
    this.model = config.model || "gemini-2.5-flash";
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  setModel(model: GeminiModel) {
    this.model = model;
  }

  async generateContent(prompt: string, options?: any): Promise<string> {
    return this.retry(async () => {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        ...options,
      });
      return response.text || "";
    });
  }

  private async retry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i <= this.maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < this.maxRetries) {
          await this.sleep(this.retryDelay * (i + 1));
        }
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
