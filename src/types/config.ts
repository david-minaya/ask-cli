export interface Config {
  providers: {
    [id: string]: {
      apiKey?: string;
    };
  };
  model?: {
    provider: string;
    model: string;
    apiKey: string;
  };
}
