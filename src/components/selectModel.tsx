import { measureElement, useInput, Box, Text, DOMElement } from 'ink';
import { useState, useRef, useMemo, useEffect, Key } from 'react';
import { ScrollViewRef, ScrollView } from 'ink-scroll-view';
import { Fragment } from 'react/jsx-runtime';
import { providers } from '../providers.ts';
import { Model } from '../types/model.ts';
import { configStore } from '../stores/config.ts';
import { Provider } from '../types/provider.ts';
import { ApiKeyField } from './apiKeyField.tsx';

type ProviderItem = { type: 'provider'; key: Key; provider: string };
type ModelItem = { type: 'model'; key: Key; model: Model };
type NewLineItem = { type: 'new-line'; key: Key };
type Item = ProviderItem | ModelItem | NewLineItem;

const config = await configStore.get();

interface Props {
  onSelect: (model: Model, apiKey: string) => void;
}

export function SelectModel(props: Props) {

  const { onSelect } = props;

  const [view, setView] = useState<'select-model' | 'set-api-key'>('select-model');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [model, setModel] = useState<Model>();
  const [provider, setProvider] = useState<Provider>();
  const [startPosition, setStartPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(0);
  const scrollRef = useRef<ScrollViewRef>(null);

  const contentRef = useRef<DOMElement>(null);

  const items = useMemo(() => {

    const items: Item[] = [];

    const selectedModel = providers.flatMap(provider => provider.models).find(m => m.name === config.model?.model);

    if (selectedModel) {
      items.push({ type: 'provider', key: 'selected-model-title', provider: 'Selected model' });
      items.push({ type: 'model', key: 'selected-model', model: selectedModel });
      items.push({ type: 'new-line', key: 'selected-model-newline' });
    }

    for (const provider of providers) {
      items.push({ type: 'provider', key: provider.name, provider: provider.name });
      for (const model of provider.models) {
        items.push({ type: 'model', key: model.name, model: model });
      }
      items.push({ type: 'new-line', key: `${provider.name}-newline` });
    }

    return items;
  }, []);

  useEffect(() => {
    const height = process.stdout.rows - 2;
    const contentSize = measureElement(contentRef.current!);
    const scrollViewHeight = height - contentSize.height;
    setScrollViewHeight(scrollViewHeight);
    setEndPosition(scrollViewHeight - 1);
  }, []);

  useEffect(() => {
    setCurrentPosition(items.findIndex(item => item.type === 'model'));
  }, [items]);

  useInput((_, key) => {

    if (key.upArrow) {
      
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
    
    if (key.downArrow) {

      const nextModelItemIndex = items.findIndex((item, index)=> item.type === 'model' && index > currentPosition);
      const position = nextModelItemIndex === -1 ? currentPosition : nextModelItemIndex;
      
      setCurrentPosition(position);
      
      if (position > endPosition && position < items.length - 1) {
        scrollRef.current?.scrollBy(position - endPosition);
        setStartPosition(position - (scrollViewHeight - 1));
        setEndPosition(position);
      }
    }
    
    if (key.return) {
      void handleSelectModel((items[currentPosition] as ModelItem).model);
    }
  });

  async function handleSelectModel(model: Model) {
  
    const provider = providers.find(provider => provider.models.some(item => item.name === model.name));
    const config = await configStore.get();
    const apikey = config.providers[provider!.id].apiKey;

    setProvider(provider);
    setModel(model);
    
    if (!apikey) {
      setView('set-api-key');
      return;
    }

    void save(provider!, model, apikey);
  }

  function handleApiKeyChange(apiKey: string) {
    void save(provider!, model!, apiKey);
  }

  async function save(provider: Provider, model: Model, apikey: string) {
    await configStore.setProviderApiKey(provider.id, apikey);
    await configStore.setModel(provider.id, model.name);
    onSelect(model, apikey);
  }

  return (
    <Box>
      {view === 'select-model' &&
        <Box ref={contentRef} flexDirection='column'>
          <Text bold>Select a model</Text>
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
                      key={item.model.name}
                      color={index === currentPosition ? 'cyanBright' : undefined}
                      inverse={index === currentPosition}>
                      {item.model.title}
                    </Text>
                  }
                  {item.type === 'new-line' && 
                    <Text> </Text>
                  }
                </Fragment>
              )}
            </ScrollView>
          </Box>
          <Box marginTop={1}>
            <Text color='gray'>{'Esc (Exit), Enter (Select)'}</Text>
          </Box>
        </Box>
      }
      {view === 'set-api-key' &&
        <ApiKeyField
          title={`${provider?.name} Api Key`}
          commands='Esc (Exit), Ctrl+V (Paste), Enter (Save)'
          onChange={handleApiKeyChange}/>
      }
    </Box>
  );
}
