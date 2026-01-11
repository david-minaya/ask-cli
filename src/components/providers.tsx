import { measureElement, useInput, Box, Text, DOMElement } from 'ink';
import { ScrollList } from 'ink-scroll-list';
import { useState, useRef, useMemo, useEffect } from 'react';
import { providers as providerList } from '../providers.ts';
import { Provider } from '../types/provider.ts';

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

  useInput((_, key) => {

    if (key.escape) {
      setVisible(false);
      setEvent('exit');
    }

    if (key.upArrow) {
      setCurrentIndex((index) => index - 1 >= 0 ? index - 1 : providerList.length - 1);
    } 
    
    if (key.downArrow) {
      setCurrentIndex((index) => index + 1 < providerList.length ? index + 1 : 0);
    }

    if (key.return) {
      onSelect(providerList[currentIndex]);
    }
  });

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
        <Box marginTop={1}>
          <Text color='gray'>{'Esc (Exit), Enter (Select)'}</Text>
        </Box>
      </Box>
    </Box>
  );
}
