import { Box, Key, Text, useInput } from 'ink';
import { Children, createContext, ReactElement, useState } from 'react';
import { CommandProps } from './command.tsx';

type InputEvent = { key: Key; input: string };

export const CommandContext = createContext<InputEvent | undefined>(undefined);

interface Props {
  children: ReactElement<CommandProps> | ReactElement<CommandProps>[];
}

export function Commands(props: Props) {

  const [inputEvent, setInputEvent] = useState<InputEvent>();

  useInput((input, key) => {
    setInputEvent({ input, key });
  });

  const children = Children.map(props.children, child => child);

  return (
    <CommandContext.Provider value={inputEvent}>
      <Box marginTop={1} gap={1}>
        {children.filter(child => child.props.title && !child.props.hidden).map((child, index, children) => 
          <Box key={index}>
            {child}
            {index !== children.length - 1 &&
              <Text color='gray'>,</Text>
            }
          </Box>
        )}
        {children.filter(child => !child.props.title || child.props.hidden).map((child) => 
          child
        )}
      </Box>
    </CommandContext.Provider>
  );
}
