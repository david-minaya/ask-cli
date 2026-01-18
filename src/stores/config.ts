import { Config } from '../types/config.ts';
import { defaultConfig } from '../utils/defaultConfig.ts';
import { configPath } from '../utils/paths.ts';
import { Store } from './store.ts';

class ConfigStore {

  private store: Store;
  private config?: Config;

  constructor() {
    this.store = new Store(configPath);
  }

  async get() {
    if (this.config) return this.config;
    this.config = await this.store.get<Config>(defaultConfig);
    return this.config;
  }

  async setModel(provider: string, model: string) {
    const config = await this.get();
    config.model = { provider, model };
    await this.save(config);
  }

  async setProviderApiKey(providerId: string, apiKey: string) {
    const config = await this.get();
    config.providers[providerId].apiKey = apiKey;
    await this.save(config);
  }

  async save(config: Config) {
    this.config = config;
    await this.store.save(config);
  }
}

export const configStore = new ConfigStore();
