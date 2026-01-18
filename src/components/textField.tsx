import { Text, TextProps } from 'ink';
import TextInput from 'ink-text-input';
import { useEffect, useState } from 'react';

interface Props {
  value: string;
  placeholder?: string;
  color?: TextProps['color'];
  inverse?: TextProps['inverse'];
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export function TextField(props: Props) {

  const { 
    value: initialValue, 
    placeholder,
    color,
    inverse,
    onChange, 
    onSubmit 
  } = props;

  const [value, setValue] =  useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onChange(value);
  }, [value]);
  
  function handleChange(input: string) {
    // Workaround for paste detection in Linux terminals.
    // When the user pastes a long text, it is split into multiple input events,
    // which causes only a part of the text to be saved in the state.
    // To fix this, we check if the user is pasting text and then append the value
    // to the existing one. To detect when the user is pasting, we check the length
    // of the input value. If the difference between the new value and the current
    // state is greater than 1, we assume the user is pasting.
    if (input.length - value.length > 1 && value.trim() === '') {
      setValue(value => value + input);
    } else {
      setValue(input);
    }
  }

  return (
    <Text color={color} inverse={inverse}>
      <TextInput 
        value={value}
        onChange={handleChange}
        onSubmit={() => onSubmit?.(value)}
        placeholder={placeholder}
      />
    </Text>
  );
}
