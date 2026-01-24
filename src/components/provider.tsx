import { Box, Text } from 'ink';
import { Fragment, useEffect, useState } from 'react';
import { Provider } from '../types/provider.ts';
import { configStore } from '../stores/config.ts';
import { Commands } from './commands.tsx';
import { Command } from './command.tsx';
import { TextField } from './textField.tsx';
import { validateUrl } from '../utils/validateUrl.ts';
import { useField } from '../hooks/useField.ts';
import { useExit } from '../hooks/useExit.ts';
import { useTestProvider } from '../hooks/useTestProvider.ts';
import { TestProvider } from './testProvider.tsx';

interface Props {
  provider: Provider;
  onClose: () => void;
}

export function Provider(props: Props) {

  const { provider, onClose } = props;
  
  const [saved, setSaved] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [name, setName] = useState(provider.name);
  const [exit, setExit] = useExit();

  const nameField = useField({ value: provider.name });
  const urlField = useField({ value: provider.url ?? '' });
  const apiKeyField = useField({ value: provider.key ?? '' });
  
  const testProvider = useTestProvider();

  useEffect(() => {
    updateFocus(0);
  }, []);

  function handleExit() {
    setExit(true);
  }

  function handleGoBack() {
    onClose();
  }

  function handleUp() {
    updateFocus(focusIndex - 1);
  }

  function handleDown() {
    updateFocus(focusIndex + 1);
  }

  async function handleDelete() {
    await configStore.deleteProvider(provider.id);
    handleGoBack();
  }

  async function handleSave() {

    setSaved(false);

    if (!validate() || !await test()) return;

    if (provider.type === 'openai-compatible') {

      await configStore.updateProvider(provider.id, {
        key: apiKeyField.value,
        name: nameField.value,
        url: urlField.value
      });

      setName(nameField.value);

    } else {
      
      await configStore.updateProvider(provider.id, {
        key: apiKeyField.value
      });
    }

    setSaved(true);
  }

  function validate() {

    let valid = true;

    nameField.error = undefined;
    urlField.error = undefined;

    if (provider.type === 'openai-compatible') {

      if (!nameField.value.trim()) {
        nameField.error = 'Required';
        valid = false;
      }

      if (!urlField.value.trim()) {
        urlField.error = 'Required';
        valid = false;
      }

      if (urlField.value.trim() && !validateUrl(urlField.value)) {
        urlField.error = 'Invalid';
        valid = false;
      }
    }

    return valid;
  }

  async function test() {
    return testProvider.test({ type: provider.type, key: apiKeyField.value, url: urlField.value });
  }

  function updateFocus(index: number) {

    const fields = provider.type === 'openai-compatible' 
      ? [nameField, urlField, apiKeyField] 
      : [apiKeyField];

    const focusIndex = Math.min(Math.max(index, 0), fields.length - 1);

    for (let i = 0; i < fields.length; i++) {
      fields[i].focus = i === focusIndex;
    }
    
    setFocusIndex(focusIndex);
  }

  if (exit) return null;

  return (
    <Box flexDirection='column'>
      <Text color='whiteBright' bold>{name}</Text>
      <Box flexDirection='column' gap={1} marginTop={1}>
        {provider.type === 'openai-compatible' && 
          <Fragment>
            <TextField
              label='Name'
              placeholder='Provider name'
              focus={nameField.focus}
              value={nameField.value}
              onChange={value => nameField.change(value)}/>
            <TextField
              label='API url'
              placeholder='OpenAI-compatible API URL'
              focus={urlField.focus}
              value={urlField.value}
              onChange={value => urlField.change(value)}/>
          </Fragment>
        }
        <TextField
          label='API key'
          placeholder='API key (optional)'
          focus={apiKeyField.focus}
          value={apiKeyField.value}
          onChange={value => apiKeyField.change(value)}/>
      </Box>
      <TestProvider
        type={provider.type}
        testing={testProvider.testing}
        error={testProvider.error}/>
      {!testProvider.testing && saved &&
        <Box marginTop={1}>
          <Text color='blueBright'>¡Provider updated!</Text>
        </Box>
      }
      <Box flexDirection='row' gap={1}>
        <Commands>
          <Command title='Esc (Exit)' esc onPress={handleExit}/>
          <Command title='Up/Down (Navigation)' up down anyKey hidden={provider.type !== 'openai-compatible'}/>
          <Command title='Ctrl+B (Go Back)' ctrl inputKey='b' onPress={handleGoBack}/>
          <Command title='Ctrl+D (Delete)' ctrl inputKey='d' hidden={provider.type !== 'openai-compatible'} onPress={handleDelete}/>
          <Command title='Ctrl+S (Save)' ctrl inputKey='s' onPress={handleSave}/>
          <Command tab onPress={handleDown}/>
          <Command up onPress={handleUp}/>
          <Command down onPress={handleDown}/>
        </Commands>
      </Box>
    </Box>
  );
}
