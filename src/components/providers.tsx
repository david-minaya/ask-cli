import { measureElement, Box, Text, DOMElement } from 'ink';
import { ScrollList } from 'ink-scroll-list';
import { useState, useRef, useMemo, useEffect } from 'react';
import { providers as providerList } from '../providers.ts';
import { Provider } from '../types/provider.ts';
import { Commands } from './commands.tsx';
import { Command } from './command.tsx';

interface Props {
  onSelect: (provider: Provider) => void;
}

export function Providers(props: Props) {

  const { onSelect } = props;

  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollListHeight, setScrollListHeight] = useState<number>();
  const [event, setEvent] = useState<string>();

  const contentRef = useRef<DOMElement>(null);

  const height = useMemo(() => process.stdout.rows - 2, []);

  useEffect(() => {
    const contentSize = measureElement(contentRef.current!);
    const scrollListHeight = height - contentSize.height;
    setScrollListHeight(providerList.length > scrollListHeight ? scrollListHeight : undefined);
  }, [height]);

  useEffect(() => {
    if (event === 'exit') {
      process.exit();
    }
  }, [event]);

  function handleExit() {
    setVisible(false);
    setEvent('exit');
  }

  function handleUp() {
    setCurrentIndex((index) => index - 1 >= 0 ? index - 1 : providerList.length - 1);
  }

  function handleDown() {
    setCurrentIndex((index) => index + 1 < providerList.length ? index + 1 : 0);
  }

  function handleSelect() {
    onSelect(providerList[currentIndex]);
  }
  if (!visible) return null;

  return (
    <Box flexDirection='column'>
      <Box flexDirection='column' ref={contentRef}>
        <Text bold>Providers</Text>
        <Box 
          height={scrollListHeight}
          borderStyle='single'
          borderColor='cyan'
          borderTop={false}
          borderRight={false}
          borderBottom={false}
          paddingLeft={1}
          marginTop={1}>
          <ScrollList selectedIndex={currentIndex}>
            {providerList.map((provider, index) => (
              <Text 
                key={provider.name}
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
