import { readFile, writeFile } from 'fs/promises';

export class Store {

  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  async get<T>(defaultData: T) {
    try {
      const content = await readFile(this.path, 'utf-8');
      return JSON.parse(content) as T;
    } catch {
      return defaultData;
    }
  }
  
  async save(data: unknown) {
    await writeFile(this.path, JSON.stringify(data));
  }
}
