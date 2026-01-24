import { measureElement, Box, Text, DOMElement } from 'ink';
import { ScrollList } from 'ink-scroll-list';
import { useState, useRef, useMemo, useEffect } from 'react';
import { Provider } from '../types/provider.ts';
import { Commands } from './commands.tsx';
import { Command } from './command.tsx';
import { configStore } from '../stores/config.ts';
import { useExit } from '../hooks/useExit.ts';

const config = await configStore.get();

interface Props {
  onSelect: (provider: Provider) => void;
}

export function Providers(props: Props) {

  const { onSelect } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollListHeight, setScrollListHeight] = useState<number | undefined>(0);
  const [providers, setProviders] = useState<Provider[]>(Object.values(config.providers));
  const [exit, setExit] = useExit();

  const contentRef = useRef<DOMElement>(null);

  const height = useMemo(() => process.stdout.rows - 2, []);

  useEffect(() => {
    void (async () => {
      const config = await configStore.get();
      setProviders(Object.values(config.providers));
    })();
  }, []);

  useEffect(() => {
    const contentSize = measureElement(contentRef.current!);
    const scrollListHeight = Math.min(height - contentSize.height, 20);
    setScrollListHeight(providers.length > scrollListHeight ? scrollListHeight : undefined);
  }, [height]);

  function handleExit() {
    setExit(true);
  }

  function handleUp() {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function handleDown() {
    setCurrentIndex((index) => Math.min(providers.length - 1, index + 1));
  }

  function handleSelect() {
    onSelect(providers[currentIndex]);
  }
  if (exit) return null;

  return (
    <Box flexDirection='column'>
      <Box flexDirection='column' ref={contentRef}>
        <Text color='whiteBright' bold>Providers</Text>
        <Box 
          borderStyle='single'
          borderColor='cyan'
          borderTop={false}
          borderRight={false}
          borderBottom={false}
          paddingLeft={1}
          marginTop={1}>
          <ScrollList height={scrollListHeight} selectedIndex={currentIndex}>
            {providers.map((provider, index) => (
              <Text 
                key={provider.id}
                color={index === currentIndex ? 'cyanBright' : undefined}
                inverse={index === currentIndex}>
                {provider.name}
              </Text>
            ))}
          </ScrollList>
        </Box>
        <Commands>
          <Command title='Esc (Exit)' esc onPress={handleExit}/>
          <Command title='Enter (Select)' enter onPress={handleSelect}/>
          <Command up onPress={handleUp} />
          <Command down onPress={handleDown} />
        </Commands>
      </Box>
    </Box>
  );
}
