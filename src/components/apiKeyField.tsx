import { Box, Text } from 'ink';
import { useEffect, useState } from 'react';
import { TextField } from './textField.tsx';

interface Props {
  title: string;
  commands: string;
  apiKey?: string;
  onChange: (apiKey: string) => void;
}

export function ApiKeyField(props: Props) {

  const { 
    title,
    apiKey: initialApiKey = '', 
    commands, 
    onChange 
  } = props;

  const [apiKey, setApiKey] = useState(initialApiKey);

  useEffect(() => {
    setApiKey(initialApiKey);
  }, [initialApiKey]);

  return (
    <Box flexDirection='column'>
      <Text bold>{title}</Text>
      <TextField
        label='Api key:'
        value={apiKey}
        placeholder='Enter api key'
        marginTop={1} 
        onChange={setApiKey}
        onSubmit={value => onChange(value.trim())}/>
      <Box marginTop={1}>
        <Text color='grey' dimColor>{commands}</Text>
      </Box>
    </Box>
  );
}
