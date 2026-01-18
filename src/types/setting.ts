export interface BaseSetting {
  type: unknown;
  title: string;
  description: string;
  value: unknown;
}

export interface BooleanSetting extends BaseSetting {
  type: 'boolean';
  value: boolean;
};

export interface NumberSetting extends BaseSetting {
  type: 'number';
  value: number | string;
  min: number;
  max: number;
}

export type Setting = BooleanSetting | NumberSetting;
