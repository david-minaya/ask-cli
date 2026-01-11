import { Model } from './model.ts';

export interface Provider {
  id: string;
  name: string;
  models: Model[];
}
