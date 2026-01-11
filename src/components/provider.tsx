import { measureElement, useInput, Box, Text, DOMElement } from 'ink';
import { useState, useRef, useMemo, useEffect } from 'react';
import { providers as providerList } from '../providers.ts';
import { Provider } from '../types/provider.ts';
import { configStore } from '../stores/config.ts';
import TextInput from 'ink-text-input';

const config = await configStore.get();

interface Props {
  provider: Provider;
  onClose: () => void;
}

export function Provider(props: Props) {

  const { provider, onClose } = props;

  const [enableEdit, setEnableEdit] = useState(false);
  const [apiKey, setApiKey] = useState(config.providers[provider.id]?.apiKey ?? '');
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);
  const [contentHeight, setContentHeight] = useState<number>();

  const contentRef = useRef<DOMElement>(null);

  const height = useMemo(() => process.stdout.rows - 2, []);

  useEffect(() => {
    const contentSize = measureElement(contentRef.current!);
    const contentHeight = height - contentSize.height;
    setContentHeight(providerList.length > contentHeight ? contentHeight : undefined);
  }, [height]);

  useInput((input, key) => {
    if (key.escape) onClose();
    if (input === 'e') setEnableEdit(true);
  });

  async function handleSave() {
    await configStore.setProviderApiKey(provider.id, apiKeyInput);
    setApiKey(apiKeyInput);
    setEnableEdit(false);
  }

  return (
    <Box flexDirection='column'>
      <Box flexDirection='column' ref={contentRef}>
        <Text bold>{provider.name}</Text>
        <Box 
          height={contentHeight}
          marginTop={1}>
          <Text><Text color='gray' bold>Api key:</Text> {apiKey || 'none'}</Text>
        </Box>
        {enableEdit &&
          <Box
            marginTop={1}
            borderStyle='single' 
            borderLeftColor='cyan'
            borderLeft={true} 
            borderRight={false} 
            borderTop={false} 
            borderBottom={false}
            paddingLeft={1}>
            <Text color='gray'>Key: </Text>
            <TextInput 
              value={apiKeyInput}
              onChange={setApiKeyInput}
              onSubmit={handleSave}
              placeholder="Enter api key, paste (Ctrl + V)"
            />
          </Box>
        }
        <Box marginTop={1}>
          <Text color='gray'>{'Esc (Back)  E (Edit api key)'}</Text>
        </Box>
      </Box>
    </Box>
  );
}
