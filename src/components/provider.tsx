import { useInput, Box, Text } from 'ink';
import { useEffect, useState } from 'react';
import { Provider } from '../types/provider.ts';
import { configStore } from '../stores/config.ts';
import { ApiKeyField } from './apiKeyField.tsx';

interface Props {
  provider: Provider;
  onClose: () => void;
}

const config = await configStore.get();

export function Provider(props: Props) {

  const { provider, onClose } = props;
  
  const [apiKey, setApiKey] = useState(config?.providers[provider.id]?.apiKey);
  const [exit, setExit] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (exit) {
      setTimeout(() => process.exit(), 0);
    }
  }, [exit]);

  useInput((input, key) => {
    if (key.escape) setExit(true);
    if (input.toLowerCase() === 'q') onClose();
  });

  async function handleSave(apiKey: string) {
    await configStore.setProviderApiKey(provider.id, apiKey);
    setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 1000);
  }

  if (exit) return null;

  return (
    <Box flexDirection='column'>
      <ApiKeyField
        title={provider.name}
        apiKey={apiKey}
        commands='Esc (Exit), Q (Go Back), Ctrl+V (Paste), Enter (Save)'
        onChange={handleSave}/>
      {saved &&
        <Box marginTop={1}>
          <Text color='cyan' bold>Saved!</Text>
        </Box>
      }
    </Box>
  );
}
