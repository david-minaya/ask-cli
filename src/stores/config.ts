import { Config } from '../types/config.ts';
import { Provider } from '../types/provider.ts';
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

  async addProvider(name: string, url: string, key: string, models: string[]) {
    
    const config = await this.get();
    const time = Math.round(Date.now() / 1000);
    const id = `${name.toLowerCase().replaceAll(' ', '-')}-${time}`;
    
    config.providers[id] = {
      id,
      type: 'openai-compatible',
      key,
      name,
      url,
      models: models.map(model => ({
        id: model,
        name: model
      }))
    };

    await this.save(config);
  }

  async updateProvider(id: string, provider: Partial<Provider>) {
    const config = await this.get();
    config.providers[id] = { ...config.providers[id], ...provider };
    await this.save(config);
  }

  async deleteProvider(id: string) {

    const config = await this.get();
    
    delete config.providers[id];

    if (config.model?.providerId === id) {
      config.model = undefined;
    }

    await this.save(config);
  }

  async setModel(providerId: string, modelId: string) {
    const config = await this.get();
    config.model = { providerId, id: modelId };
    await this.save(config);
  }

  async setProviderApiKey(providerId: string, key: string) {
    const config = await this.get();
    config.providers[providerId].key = key;
    await this.save(config);
  }

  async save(config: Config) {
    await this.store.save(config);
  }
}

export const configStore = new ConfigStore();
