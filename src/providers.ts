import { Provider } from './types/provider.ts';

export const providers: Provider[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    models: [
      { title: 'Gemini 3 Flash Preview', name: 'gemini-3-flash-preview', config: { thinkingConfig: { thinkingLevel: 'LOW' } } },
      { title: 'Gemini 3 Pro Preview', name: 'gemini-3-pro-preview', config: { thinkingConfig: { thinkingLevel: 'LOW' } } },
      { title: 'Gemini 2.5 Flash', name: 'gemini-2.5-flash', config: { thinkingBudget: 500 } },
      { title: 'Gemini 2.5 Flash Lite', name: 'gemini-2.5-flash-lite', config: { thinkingBudget: 512 } },
      { title: 'Gemini 2.5 Pro', name: 'gemini-2.5-pro', config: { thinkingBudget: 500 } }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      { title: 'GPT-5 Mini', name: 'gpt-5-mini', config: { effort: 'low' } },
      { title: 'GPT-5 Nano', name: 'gpt-5-nano', config: { effort: 'low' } },
      { title: 'GPT-5', name: 'gpt-5', config: { effort: 'low' } },
      { title: 'GPT-5.2', name: 'gpt-5.2', config: { effort: 'low' } },
      { title: 'GPT-5.2 Pro', name: 'gpt-5.2-pro', config: { effort: 'low' } },
      { title: 'GPT-4.1', name: 'gpt-4.1' },
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      { title: 'Claude Haiku 4.5', name: 'claude-haiku-4-5' },
      { title: 'Claude Sonnet 4.5', name: 'claude-sonnet-4-5' },
      { title: 'Claude Opus 4.5', name: 'claude-opus-4-5' }
    ]
  }
];
