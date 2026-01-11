import TextInput from 'ink-text-input';
import { Box, Text } from 'ink';
import { Provider } from '../types/provider.ts';
import { useState } from 'react';

interface Props {
  provider: Provider;
  onChange: (apiKey: string) => void;
}

export function ApiKey(props: Props) {

  const { provider, onChange } = props;

  const [apiKey, setApiKey] = useState('');

  return (
    <Box flexDirection='column'>
      <Text bold>{provider?.name} Api Key:</Text>
      <Box 
        flexDirection='column' 
        marginTop={1}
        borderStyle='single' 
        borderLeftColor='cyan'
        borderLeft={true} 
        borderRight={false} 
        borderTop={false} 
        borderBottom={false}
        paddingLeft={1}>
        <TextInput 
          value={apiKey}
          onChange={setApiKey}
          onSubmit={() => onChange(apiKey)}
          placeholder="Enter api key, paste (Ctrl+V)"
        />
      </Box>
      <Box marginTop={1}>
        <Text color='grey' dimColor>{'Esc (Exit) | Enter (Save)'}</Text>
      </Box>
    </Box>
  );
}
