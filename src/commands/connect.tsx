import OpenAI from 'openai';
import Spinner from 'ink-spinner';
import { useEffect, useState } from 'react';
import { render, Box, Text } from 'ink';
import { TextField } from '../components/textField.tsx';
import { Commands } from '../components/commands.tsx';
import { Command } from '../components/command.tsx';
import { configStore } from '../stores/config.ts';
import { useField } from '../hooks/useField.ts';
import { useExit } from '../hooks/useExit.ts';
import { useTestProvider } from '../hooks/useTestProvider.ts';
import { TestProvider } from '../components/testProvider.tsx';

export function connect() {
  render(<Connect/>);
}

function Connect() {

  const [view, setView] = useState<'connect' | 'save'>('connect');
  const [focusIndex, setFocusIndex] = useState(0);
  const [models, setModels] = useState<string[]>([]);
  const [testSuccessful, setTestSuccessful] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const [exit, setExit] = useExit();
  
  const nameField = useField({ focus: false });
  const urlField = useField({ focus: false });
  const apiKeyField = useField({ focus: false });

  const testProvider = useTestProvider();

  useEffect(() => {
    setTimeout(() => {}, 1000 * 60 * 60 * 24);
    updateFocus(0);
  }, []);

  useEffect(() => {
    if (saved || saveFailed) {
      setTimeout(() => process.exit(), 0);
    }
  }, [saved, saveFailed]);

  function handleExit() {
    setExit(true);
  }

  function handleUp() {
    updateFocus(focusIndex - 1);
  }

  function handleDown() {
    updateFocus(focusIndex + 1);
  }

  async function handleTest() {

    setTestSuccessful(false);

    if (!validate()) return;

    if (await test()) {
      setTestSuccessful(true);
    }
  }

  async function handleSave() {

    setTestSuccessful(false);

    if (!validate() || !await test()) return;

    setView('save');
    setSaving(true);
    
    try {

      const client = new OpenAI({ baseURL: urlField.value, apiKey: apiKeyField.value });

      const models = await client.models.list();

      setModels(models.data.map(model => model.id));

      await configStore.addProvider(
        nameField.value,
        urlField.value,
        apiKeyField.value,
        models.data.map(model => model.id)
      );

      setSaving(false);
      setSaved(true);
    
    } catch (error) {
    
      setSaving(false);
      setSaveError((error as Error).message.replaceAll(/(\n|\r|\r\n)/g, ' '));
      setSaveFailed(true);
    }
  }

  function validate() {

    let valid = true;

    nameField.error = undefined;
    urlField.error = undefined;

    if (!nameField.value.trim()) {
      nameField.error = 'Required';
      valid = false;
    }

    if (!urlField.value.trim()) {
      urlField.error = 'Required';
      valid = false;
    }

    return valid;
  }

  async function test() {
    return testProvider.test({ type: 'openai-compatible', url: urlField.value, key: apiKeyField.value });
  }

  function updateFocus(index: number) {

    const fields = [nameField, urlField, apiKeyField];
    const focusIndex = Math.min(Math.max(index, 0), fields.length - 1);

    for (let i = 0; i < fields.length; i++) {
      fields[i].focus = i === focusIndex;
    }
    
    setFocusIndex(focusIndex);
  }

  if (exit) return null;

  return (
    <Box>
      {view === 'connect' &&
        <Box flexDirection='column'>
          <Text color='whiteBright' bold>Connect</Text>
          <Box 
            width={80} 
            flexDirection='column'
            borderColor='gray'
            borderTop={false}
            borderRight={false}
            borderBottom={false}
            marginTop={1}>
            <Text color='gray'>
              Connect to local models or external providers using an <Text bold>OpenAI-compatible API</Text>, e.g., llama.cpp, Ollama, Hugging Face, etc.
            </Text>
          </Box>
          <Box flexDirection='column' gap={1} marginTop={1}>
            <TextField
              label='Name' 
              placeholder='Provider name' 
              focus={nameField.focus} 
              value={nameField.value}
              error={nameField.error}
              onChange={value => nameField.change(value)}/>
            <TextField
              label='API url' 
              placeholder='OpenAI-compatible API URL'
              focus={urlField.focus} 
              value={urlField.value}
              error={urlField.error}
              onChange={value => urlField.change(value)}/>
            <TextField
              label='API key' 
              placeholder='API key (Optional)' 
              focus={apiKeyField.focus} 
              value={apiKeyField.value}
              error={apiKeyField.error}
              onChange={value => apiKeyField.change(value)}/>
          </Box>
          <TestProvider
            type='openai-compatible'
            testing={testProvider.testing}
            error={testProvider.error}/>
          {testSuccessful &&
            <Box marginTop={1}>
              <Text bold color='green'>¡Connected!</Text>
            </Box>
          }
          <Commands>
            <Command title='Esc (Exit)' esc onPress={handleExit}/>
            <Command title='Up/Down (Navigation)' up down anyKey/>
            <Command title='Ctrl+T (Test connection)' ctrl inputKey='t' onPress={handleTest}/>
            <Command title='Ctrl+S (Save)' ctrl inputKey='s' onPress={handleSave}/>
            <Command tab onPress={handleDown} />
            <Command up onPress={handleUp} />
            <Command down onPress={handleDown} />
          </Commands>
        </Box>
      }
      {view === 'save' &&
        <Box>
          {saving &&
            <Box>
              <Text color='yellow'>Saving provider<Spinner type='simpleDots'/></Text>
            </Box>
          }
          {saved &&
            <Box flexDirection='column'>
              <Text>Provider saved!</Text>
              <Box marginTop={1}>
                <Text bold>Provider:</Text>
              </Box>
              <Box>
                <Text>{nameField.value}</Text>
              </Box>
              <Box flexDirection='column' marginTop={1}> 
                <Text bold>Models:</Text>
                <Box flexDirection='column' paddingLeft={1}>
                  {models.map(model => 
                    <Text key={model}>● {model}</Text>
                  )}
                </Box>
              </Box>
              <Box flexDirection='column' marginTop={1}>
                <Text>To see the models of the provider, use the <Text color='cyan' bold>ask /models</Text> command.</Text>
                <Text>To update the provider, use the <Text color='cyan' bold>ask /providers</Text> command.</Text>
              </Box>
            </Box>
          }
          {saveFailed &&
            <Box flexDirection='column' marginTop={1} gap={1}>
              <Text>Error saving provider:</Text>
              <Text color='red'>{saveError}</Text>
            </Box>
          }
        </Box>
      }
    </Box>
  );
}
