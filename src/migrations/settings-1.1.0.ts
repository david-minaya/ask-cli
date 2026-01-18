import fs from 'fs';
import path from 'path';
import { configPath, dataDir, historyDir } from '../utils/paths.ts';
import { configStore } from '../stores/config.ts';
import { defaultConfig } from '../utils/defaultConfig.ts';

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
  await configStore.save(defaultConfig);
}

const config = await configStore.get();

if (config.settings === undefined) {
  config.settings = defaultConfig.settings;
  await configStore.save(config);
}
