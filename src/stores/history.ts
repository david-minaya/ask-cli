import path from 'node:path';
import fs from 'node:fs/promises';
import { Message } from '../types/message.ts';
import { Store } from './store.ts';
import { historyDir } from '../utils/paths.ts';

class HistoryStore {

  private store: Store;
  private history?: Message[];

  constructor() {
    this.store = new Store(path.join(historyDir, `history.${process.ppid}.json`));
  }

  async get() {
    if (this.history) return this.history;
    this.history = await this.store.get<Message[]>([]);
    return this.history;
  }

  async add(message: Message | Message[]) {
    const messages = Array.isArray(message) ? message : [message];
    const history = await this.get();
    history.push(...messages);
    await this.save(history);
  }

  async clear() {
    this.history = [];
    await this.save(this.history);
  }

  async deleteOldHistory() {

    const fileNames = await fs.readdir(historyDir);

    const files = await Promise.all(fileNames.map(async name => {
      const filePath = path.join(historyDir, name);
      const stats = await fs.stat(filePath);
      return { path: filePath, time: stats.ctimeMs };
    }));

    const sortedFiles = files
      .sort((a, b) => b.time - a.time)
      .slice(10);
    
    await Promise.all(sortedFiles.map(file => fs.unlink(file.path)));
  }

  async save(history: Message[]) {
    await this.store.save(history);
  }
}

export const historyStore = new HistoryStore();
