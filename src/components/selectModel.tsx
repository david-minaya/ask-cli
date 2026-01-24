import { measureElement, Box, Text, DOMElement } from 'ink';
import { useState, useRef, useMemo, useEffect, Key } from 'react';
import { ScrollViewRef, ScrollView } from 'ink-scroll-view';
import { Fragment } from 'react/jsx-runtime';
import { Model } from '../types/model.ts';
import { configStore } from '../stores/config.ts';
import { Provider } from '../types/provider.ts';
import { Commands } from './commands.tsx';
import { Command } from './command.tsx';
import { OpenAIClient } from '@langchain/openai';
import { TextField } from './textField.tsx';
import { useExit } from '../hooks/useExit.ts';
import { useTestProvider } from '../hooks/useTestProvider.ts';
import { TestProvider } from './testProvider.tsx';

type ProviderItem = { type: 'provider'; key: Key; provider: string };
type ModelItem = { type: 'model'; key: Key; provider: Provider; model: Model };
type ModelsNotFound = { type: 'models-not-found'; title: string; key: Key };
type NewLineItem = { type: 'new-line'; key: Key };
type Item = ProviderItem | ModelItem | ModelsNotFound | NewLineItem;

const config = await configStore.get();

interface Props {
  onSelect: (provider: Provider, model: Model) => void;
}

export function SelectModel(props: Props) {

  const { onSelect } = props;

  const [providers, setProviders] = useState<Provider[]>(Object.values(config.providers));
  const [view, setView] = useState<'select-model' | 'set-api-key'>('select-model');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [model, setModel] = useState<Model>();
  const [provider, setProvider] = useState<Provider>();
  const [apiKey, setApiKey] = useState('');
  const [startPosition, setStartPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(0);
  const [exit, setExit] = useExit();

  const testProvider = useTestProvider();

  const scrollRef = useRef<ScrollViewRef>(null);
  const contentRef = useRef<DOMElement>(null);

  const items = useMemo(() => {

    const items: Item[] = [];
    
    const provider = providers.find(provider => config.model?.providerId === provider.id);
    const selectedModel = provider?.models.find(m => m.id === config.model?.id);

    if (provider && selectedModel) {
      items.push({ type: 'provider', key: 'selected-model-title', provider: 'Selected model' });
      items.push({ type: 'model', key: 'selected-model', provider, model: selectedModel });
      items.push({ type: 'new-line', key: 'selected-model-newline' });
    }

    for (const provider of providers) {

      items.push({ type: 'provider', key: provider.id, provider: provider.name });
      
      if (provider.models.length === 0) {
        items.push({ type: 'models-not-found', key: `${provider.id}-no-models`, title: 'No models available' });
      }
      
      for (const model of provider.models) {
        items.push({ type: 'model', key: `${provider.id}-${model.id}`, provider, model: model });
      }
      
      items.push({ type: 'new-line', key: `${provider.id}-newline` });
    }

    return items;
  }, [providers]);

  useEffect(() => {
    const height = process.stdout.rows - 2;
    const contentSize = measureElement(contentRef.current!);
    const scrollViewHeight = Math.min(height - contentSize.height, 20);
    setScrollViewHeight(scrollViewHeight);
    setEndPosition(scrollViewHeight - 1);
  }, []);

  useEffect(() => {
    setCurrentPosition(items.findIndex(item => item.type === 'model'));
  }, [items]);

  useEffect(() => {
    void (async () => {

      const providers = Object
        .values(config.providers)
        .filter(provider => provider.type === 'openai-compatible');
      
      await Promise.allSettled(providers.map(async (provider) => {

        const client = new OpenAIClient({
          baseURL: provider.url,
          apiKey: provider.key,
        });
  
        const models = await client.models.list();

        await configStore.updateProvider(provider.id, { 
          models: models.data.map(model => ({ 
            id: model.id, 
            name: model.id 
          })) 
        });
      }));

      const configUpdated = await configStore.get();

      setProviders(Object.values(configUpdated.providers));
    })();
  }, []);

  function handleExit() {
    setExit(true);
  }

  function handleUp() {

    const previousModelItemIndex = items.findLastIndex((item, index) => item.type === 'model' && index < currentPosition);
    const position = previousModelItemIndex === -1 ? currentPosition : previousModelItemIndex;
    
    setCurrentPosition(position);

    if (position < startPosition) {
      scrollRef.current?.scrollBy(position - startPosition);
      setStartPosition(position);
      setEndPosition(position + (scrollViewHeight - 1));
      return;
    }

    if (items.findIndex(item => item.type === 'model') === position) {
      scrollRef.current?.scrollToTop();
      setStartPosition(0);
      setEndPosition(scrollViewHeight - 1);
    }
  }

  function handleDown() {

    const nextModelItemIndex = items.findIndex((item, index)=> item.type === 'model' && index > currentPosition);
    const position = nextModelItemIndex === -1 ? currentPosition : nextModelItemIndex;
    
    setCurrentPosition(position);
    
    if (position > endPosition && position < items.length - 1) {
      scrollRef.current?.scrollBy(position - endPosition);
      setStartPosition(position - (scrollViewHeight - 1));
      setEndPosition(position);
    }
  }

  function handleSelectModel() {
  
    const { provider, model } = (items[currentPosition] as ModelItem);

    setProvider(provider);
    setModel(model);
    
    if (provider.type !== 'openai-compatible' && !provider.key) {
      setView('set-api-key');
      return;
    }

    void save(provider, model, provider.key ?? '');
  }

  async function handleSaveApiKey() {

    const isValid = await testProvider.test({ ...provider!, key: apiKey });
    
    if (isValid) {
      void save(provider!, model!, apiKey);
    }
  }

  async function save(provider: Provider, model: Model, apikey: string) {
    await configStore.setProviderApiKey(provider.id, apikey);
    await configStore.setModel(provider.id, model.id);
    onSelect(provider, model);
  }

  if (exit) return null;

  return (
    <Box>
      {view === 'select-model' &&
        <Box ref={contentRef} flexDirection='column'>
          <Text color='whiteBright' bold>Select Model</Text>
          <Box
            flexDirection='column' 
            height={scrollViewHeight < items.length ? scrollViewHeight : undefined} 
            borderStyle='single' 
            borderLeftColor='cyan'
            borderLeft={true} 
            borderRight={false} 
            borderTop={false} 
            borderBottom={false}
            marginTop={1}
            paddingLeft={1}>
            <ScrollView ref={scrollRef}>
              {items.map((item, index) => 
                <Fragment key={item.key}>
                  {item.type === 'provider' &&
                    <Text key={item.provider} bold color='blue'>{item.provider}</Text>
                  }
                  {item.type === 'model' && 
                    <Text 
                      key={item.model.id}
                      color={index === currentPosition ? 'cyanBright' : undefined}
                      inverse={index === currentPosition}>
                      {item.key === 'selected-model' && `(${item.provider.name}) `}
                      {item.model.name}
                    </Text>
                  }
                  {item.type === 'models-not-found' && 
                    <Text dimColor color='gray'>{item.title}</Text>
                  }
                  {item.type === 'new-line' && 
                    <Text> </Text>
                  }
                </Fragment>
              )}
            </ScrollView>
          </Box>
          <Commands>
            <Command title='Esc (Exit)' esc onPress={handleExit}/>
            <Command title='Enter (Select)' enter onPress={handleSelectModel}/>
            <Command up onPress={handleUp} />
            <Command down onPress={handleDown} />
          </Commands>
        </Box>
      }
      {view === 'set-api-key' &&
        <Box flexDirection='column'>
          <Text color='whiteBright' bold>Enter {provider?.name} api key</Text>
          <Box marginTop={1}>
            <TextField
              label='Api key'
              focus={true} 
              value={apiKey} 
              placeholder='Enter api key'
              onChange={setApiKey}/>
          </Box>
          {provider &&
            <TestProvider
              type={provider.type}
              testing={testProvider.testing}
              error={testProvider.error}/>
          }
          <Commands>
            <Command title='Esc (Exit)' esc onPress={handleExit}/>
            <Command title='Ctrl+V (Paste)' ctrl inputKey='v'/>
            <Command title='Enter (Save)' enter onPress={handleSaveApiKey}/>
            <Command ctrl inputKey='s' onPress={handleSaveApiKey}/>
          </Commands>
        </Box>
      }
    </Box>
  );
}
