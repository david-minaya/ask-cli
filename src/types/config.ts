import { NumberSetting, BooleanSetting } from './setting.ts';

export interface Config {
  model?: {
    provider: string;
    model: string;
  };
  providers: {
    [id: string]: {
      apiKey?: string;
    };
  };
  settings: {
    metadata: BooleanSetting;
    maxOutputTokens: NumberSetting;
  };
}
