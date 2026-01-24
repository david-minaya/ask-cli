import { Box, Key, Text } from 'ink';
import { useContext, useEffect, useState } from 'react';
import { CommandContext } from './commands.tsx';

export interface CommandProps {
  title?: string;
  hidden?: boolean;
  tab?: true;
  ctrl?: true;
  esc?: true;
  enter?: true;
  up?: true;
  down?: true;
  inputKey?: string;
  anyKey?: true;
  onPress?: () => void;
}

export function Command(props: CommandProps) {

  const {
    title,
    hidden,
    tab,
    ctrl,
    esc,
    enter,
    up,
    down,
    inputKey,
    anyKey,
    onPress
  } = props;

  const [active, setActive] = useState(false);
  
  const inputEvent = useContext(CommandContext);

  useEffect(() => {

    if (!inputEvent || hidden) return;

    const keyMap: Partial<Key> = {
      tab,
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
    const isInputActive = inputEvent.input === inputKey;
    
    const isKeyActive = anyKey
      ? keys.some(key => inputEvent.key[key])
      : keys.every(key => inputEvent.key[key]);

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

  if (!title || hidden) return null;

  return (
    <Box>
      <Text color={active ? 'cyan' : 'gray'}>
        {title}
      </Text>
    </Box>
  );
}
