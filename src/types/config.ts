import { Provider } from './provider.ts';
import { NumberSetting, BooleanSetting } from './setting.ts';

export interface Config {
  version: number;
  isFirstExecution: boolean;
  model?: {
    id: string;
    providerId: string;
  };
  providers: Record<string, Provider>;
  settings: {
    metadata: BooleanSetting;
    maxOutputTokens: NumberSetting;
  };
}
