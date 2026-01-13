import { join } from 'node:path';
import { root } from './root.ts';

function getDataDir() {
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    return join(process.env.LOCALAPPDATA, 'ask-cli-ai');
  } else if (process.platform === 'darwin' && process.env.HOME) {
    return join(process.env.HOME, 'Library', 'Application Support', 'ask-cli-ai');
  } else if (process.platform === 'linux' && process.env.HOME) {
    return join(process.env.HOME, '.ask-cli-ai');
  } else {
    return join(root, 'ask-cli-ai');
  }
};

export const dataDir = getDataDir();
