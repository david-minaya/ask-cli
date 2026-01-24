/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { configPath, dataDir, historyDir } from '../utils/paths.ts';
import { configStore } from '../stores/config.ts';

export async function run() {

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (fs.existsSync(path.join(dataDir, 'chats'))) {
    fs.renameSync(path.join(dataDir, 'chats'), path.join(dataDir, 'history'));
  }
  
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }
  
  if (!fs.existsSync(configPath)) {
    await configStore.save({
      model: undefined,
      providers: {
        gemini: {
          apiKey: undefined
        },
        openai: {
          apiKey: undefined
        },
        anthropic: {
          apiKey: undefined
        }
      },
    } as any);
  }
  
  const config = await configStore.get();
  
  if (config.version === undefined) {
  
    config.version = 1;
  
    if (config.settings === undefined) {
      config.settings = {
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
      };
    }

    await configStore.save(config);
  }
}
