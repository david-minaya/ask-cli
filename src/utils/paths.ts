import path from 'path';
import { getDataDir } from './getDataDir.ts';

export const root = path.join(import.meta.dirname, '..');

export const dataDir = getDataDir(root);

export const configPath = path.join(dataDir, 'config.json');

export const historyDir = path.join(dataDir, 'history');
