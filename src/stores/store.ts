import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { readFile, mkdir, writeFile } from 'fs/promises';
import { root } from '../utils/root.ts';

async function get<T>(path: string, defaultData: T) {
  try {
    const filePath = join(root, path);
    const content = await readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return defaultData;
  }
}

async function save(path: string, data: unknown) {
  const filePath = join(root, path);
  if (!existsSync(dirname(filePath))) {
    await mkdir(dirname(filePath), { recursive: true });
  }
  await writeFile(filePath, JSON.stringify(data));
}

export const store = {
  get,
  save
};
