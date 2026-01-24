/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { configStore } from '../stores/config.ts';

export async function run() {

  const VERSION = 2;
  
  const config = await configStore.get();
  
  if (config.version < VERSION) {
  
    config.version = VERSION;
  
    config.isFirstExecution = true;
    
    if (config.model) {
      config.model = { 
        id: (config.model as any).model, 
        providerId: (config.model as any).provider
      };
    }

    config.providers = {
      gemini: {
        id: 'gemini',
        key: (config.providers.gemini as any)?.apiKey,
        type: 'gemini',
        name: 'Gemini',
        models: [
          { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview', config: { thinkingConfig: { thinkingLevel: 'LOW' } } },
          { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', config: { thinkingConfig: { thinkingLevel: 'LOW' } } },
          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', config: { thinkingBudget: 500 } },
          { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', config: { thinkingBudget: 512 } },
          { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', config: { thinkingBudget: 500 } }
        ]
      },
      openai: {
        id: 'openai',
        key: (config.providers.openai as any)?.apiKey,
        type: 'openai',
        name: 'OpenAI',
        models: [
          { id: 'gpt-5-mini', name: 'GPT-5 Mini', config: { effort: 'low' } },
          { id: 'gpt-5-nano', name: 'GPT-5 Nano', config: { effort: 'low' } },
          { id: 'gpt-5', name: 'GPT-5', config: { effort: 'low' } },
          { id: 'gpt-5.2', name: 'GPT-5.2', config: { effort: 'low' } },
          { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro', config: { effort: 'low' } },
          { id: 'gpt-4.1', name: 'GPT-4.1' },
        ]
      },
      anthropic: {
        id: 'anthropic',
        key: (config.providers.anthropic as any)?.apiKey,
        type: 'anthropic',
        name: 'Anthropic',
        models: [
          { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5' },
          { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5' },
          { id: 'claude-opus-4-5', name: 'Claude Opus 4.5' }
        ]
      }
    };
    
    await configStore.save(config);
  }
}
