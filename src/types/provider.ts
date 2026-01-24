import { Model } from './model.ts';

export interface Provider {
  id: string;
  type: 'openai' | 'anthropic' | 'gemini' | 'openai-compatible';
  url?: string;
  key?: string;
  name: string;
  models: Model[];
}
