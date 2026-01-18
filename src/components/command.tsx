import { Box, Key, Text } from 'ink';
import { useContext, useEffect, useState } from 'react';
import { CommandContext } from './commands.tsx';

export interface CommandProps {
  title?: string;
  ctrl?: true;
  esc?: true;
  enter?: true;
  up?: true;
  down?: true;
  inputKey?: string;
  onPress?: () => void;
}

export function Command(props: CommandProps) {

  const {
    title,
    ctrl,
    esc,
    enter,
    up,
    down,
    inputKey,
    onPress
  } = props;

  const [active, setActive] = useState(false);
  
  const inputEvent = useContext(CommandContext);

  useEffect(() => {

    if (!inputEvent) return;

    const keyMap: Partial<Key> = {
      ctrl,
      escape: esc,
      return: enter,
      upArrow: up,
      downArrow: down
    };

    const keys = Object
      .entries(keyMap)
      .filter(item => item[1] !== undefined)
      .map(([key]) => key as keyof Key);

    const validateKey = keys.length > 0;
    const validateInput = inputKey !== undefined;
    const isKeyActive = keys.every(key => inputEvent.key[key]);
    const isInputActive = inputEvent.input === inputKey;

    const active = isActive(validateKey, validateInput, isKeyActive, isInputActive);

    if (active) {
      onPress?.();
      setActive(true);
      setTimeout(() => setActive(false), 200);
    }
  }, [inputEvent]);

  function isActive(validateKey: boolean, validateInput: boolean, isKeyActive: boolean, isInputActive: boolean) {
    if (ctrl && inputKey === 'v' && inputEvent && inputEvent.input.length > 1) {
      return true;
    } else if (validateKey && validateInput) {
      return isKeyActive && isInputActive;
    } else if (validateKey) {
      return isKeyActive;
    } else if (validateInput) {
      return isInputActive;
    } else {
      return false;
    }
  }

  if (!title) return null;

  return (
    <Box>
      <Text 
        bold={active}
        color={active ? 'cyan' : 'gray'}>
        {title}
      </Text>
    </Box>
  );
}
