import { useState } from 'react';
import { Box, Static, Text, useInput } from 'ink';
import { SelectModel } from './selectModel.tsx';
import { Model } from '../types/model.ts';
import { logo } from '../utils/logo.ts';

interface Props {
  onSend: (model: string, apiKey: string) => void;
}

export function Welcome(props: Props) {

  const { onSend } = props;

  const [closed, setClosed] = useState(false);

  useInput((_, key) => {
    if (key.escape) {
      process.exit(0);
    }
  });

  function handleSend(model: Model, apiKey: string) {
    setClosed(true);
    onSend(model.name, apiKey);
  }

  if (closed) {
    return null;
  }

  return (
    <Box flexDirection='column'>
      <Static items={['']}>
        {item =>
          <Box flexDirection='column' key={item} marginBottom={1}>
            <Text>{logo}</Text>
            <Box flexDirection='column' marginTop={1}>
              <Text>Welcome to ASK CLI, your handy assistant to help you from the terminal!</Text>
              <Box flexDirection='column' marginTop={1} paddingLeft={1}>
                <Text>🤖  Get help about commands, coding, apps, etc.</Text>
                <Text>📝  Short and precise answers, just the info you need, straight to the point.</Text>
                <Text>🚀  Blazing fast speed, almost instant responses.</Text>
                <Text>🛡️  Safe by design, it cannot run commands or access your files without your explicit authorization.</Text>
              </Box>
            </Box>
            <Box marginTop={1}>
              <Text>To get started, select a model.</Text>
            </Box>
          </Box> 
        }
      </Static>
      <SelectModel onSelect={handleSend}/>
    </Box>
  );
}
