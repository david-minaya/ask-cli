import { useCallback, useMemo, useState } from 'react';
import { Provider } from '../types/provider.ts';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

export function useTestProvider() {

  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string>();

  const test = useCallback(async (provider: Pick<Provider, 'type' | 'key' | 'url'>) => {

    const timeoutId = setTimeout(() => {
      setTesting(true);
    }, 400);

    try {
      
      setError(undefined);

      switch (provider.type) {
        case 'gemini': await testGemini(provider.key); break;
        case 'openai': await testOpenAI(provider.key); break;
        case 'anthropic': await testAnthropic(provider.key); break;
        case 'openai-compatible': await testOpenAICompatibleAPI(provider.url, provider.key); break;
        default: throw new Error('Unknown provider');
      }

      clearTimeout(timeoutId);
      setTesting(false);
    
      return true;
    
    } catch (error) {
    
      clearTimeout(timeoutId);
      setTesting(false);
      setError((error as Error).message.replaceAll(/(\n|\r|\r\n)/g, ' '));

      return false;
    }
  }, []);

  async function testGemini(apiKey?: string) {
    const client = new GoogleGenAI({ apiKey });
    await client.models.list();
  }

  async function testOpenAI(apiKey?: string) {
    const client = new OpenAI({ apiKey });
    await client.models.list();
  }

  async function testAnthropic(apiKey?: string) {
    const client = new Anthropic({ apiKey });
    await client.models.list();
  }

  async function testOpenAICompatibleAPI(baseURL?: string, apiKey?: string) {
    const client = new OpenAI({ baseURL, apiKey });
    await client.models.list();
  }

  return useMemo(() => ({
    testing,
    error,
    test
  }), [testing, error, test]);
};
