import { Box, Text } from 'ink';
import { useEffect, useState } from 'react';
import { Provider } from '../types/provider.ts';
import { configStore } from '../stores/config.ts';
import { ApiKeyField } from './apiKeyField.tsx';
import { Commands } from './commands.tsx';
import { Command } from './command.tsx';

interface Props {
  provider: Provider;
  onClose: () => void;
}

const config = await configStore.get();

export function Provider(props: Props) {

  const { provider, onClose } = props;
  
  const [apiKey, setApiKey] = useState(config?.providers[provider.id]?.apiKey ?? '');
  const [exit, setExit] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void (async () => {
      const config = await configStore.get();
      setApiKey(config?.providers[provider.id]?.apiKey ?? '');
    })();
  }, []);

  useEffect(() => {
    if (exit) {
      setTimeout(() => process.exit(), 0);
    }
  }, [exit]);

  async function handleSave() {
    await configStore.setProviderApiKey(provider.id, apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 800);
  }

  function handleExit() {
    setExit(true);
  }

  function handleGoBack() {
    onClose();
  }

  if (exit) return null;

  return (
    <Box flexDirection='column'>
      <ApiKeyField
        title={provider.name}
        value={apiKey}
        onChange={setApiKey}/>
      <Box flexDirection='row' gap={1}>
        <Commands>
          <Command title='Esc (Exit)' esc onPress={handleExit}/>
          <Command title='Ctrl+B (Go Back)' ctrl inputKey='b' onPress={handleGoBack}/>
          <Command title='Ctrl+V (Paste)' ctrl inputKey='v'/>
          <Command title='Enter (Save)' enter onPress={handleSave}/>
        </Commands>
        {saved &&
          <Box marginTop={1}>
            <Text color='cyan' bold>¡Saved!</Text>
          </Box>
        }
      </Box>
    </Box>
  );
}
