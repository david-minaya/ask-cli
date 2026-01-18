import { Config } from '../types/config.ts';

export const defaultConfig: Config = { 
  model: undefined,
  providers: {
    gemini: {
      apiKey: undefined
    },
    anthropic: {
      apiKey: undefined
    },
    openai: {
      apiKey: undefined
    }
  },
  settings: {
    metadata: {
      type: 'boolean', 
      title: 'Metadata', 
      description: 'Show metadata at the end of each response', 
      value: true 
    },
    maxOutputTokens: { 
      type: 'number', 
      title: 'Max Output Tokens', 
      description: 'Max number of output tokens. Min 1,000, Max 10,000', value: 8000,
      min: 1000,
      max: 10000
    }
  }
};
