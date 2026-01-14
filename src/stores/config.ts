import { Config } from '../types/config.ts';
import { store } from './store.ts';

const path = 'config.json';

let config: Config;

async function get() {

  if (config) return config;

  config = await store.get<Config>(path, { 
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
    }
  });

  return config;
}

async function setModel(provider: string, model: string) {
  const config = await get();
  config.model = { provider, model };
  await save(config);
}

async function setProviderApiKey(providerId: string, apiKey: string) {
  const config = await get();
  config.providers[providerId].apiKey = apiKey;
  await save(config);
}

async function save(config: Config) {
  await store.save(path, config);
}

export const configStore = {
  get,
  setModel,
  setProviderApiKey,
  save
};
