// Enhanced Figma MCP Configuration
export interface EnhancedConfig {
  figmaApiKey: string;
  openaiApiKey?: string;
  cache: {
    enabled: boolean;
    ttl: number; // Time to live in seconds
    maxSize: number; // Max cache size in MB
  };
  batch: {
    enabled: boolean;
    maxConcurrent: number;
    retryAttempts: number;
  };
  ai: {
    enabled: boolean;
    model: string;
    temperature: number;
  };
  plugins: {
    enabled: boolean;
    websocketUrl?: string;
  };
}

export const defaultConfig: EnhancedConfig = {
  figmaApiKey: process.env.FIGMA_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY,
  cache: {
    enabled: true,
    ttl: 3600, // 1 hour
    maxSize: 100, // 100MB
  },
  batch: {
    enabled: true,
    maxConcurrent: 5,
    retryAttempts: 3,
  },
  ai: {
    enabled: !!process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview',
    temperature: 0.7,
  },
  plugins: {
    enabled: false,
    websocketUrl: process.env.FIGMA_PLUGIN_WS_URL,
  },
};
