import { Box, Text, TextProps } from 'ink';
import { TextInput } from './textInput.tsx';

interface Props {
  label?: string;
  focus?: boolean;
  value: string;
  placeholder?: string;
  error?: string;
  color?: TextProps['color'];
  inverse?: TextProps['inverse'];
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export function TextField(props: Props) {

  const {
    label,
    focus = true,
    value, 
    placeholder,
    color,
    inverse,
    error,
    onChange, 
    onSubmit 
  } = props;

  return (
    <Box
      gap={1}
      borderStyle='single'
      borderColor={focus ? 'cyan' : 'white'}
      borderTop={false}
      borderRight={false}
      borderBottom={false}
      paddingLeft={1}>
      <Box flexShrink={0}>
        <Text color={focus ? 'cyan' : 'whiteBright'}>
          {label}
        </Text>
        {error && 
          <Text color='gray'> ({error})</Text>
        }
        <Text>:</Text>
      </Box>
      <Text color={color} inverse={inverse}>
        <TextInput 
          placeholder={placeholder} 
          focus={focus} 
          value={value} 
          onChange={onChange}
          onSubmit={() => onSubmit?.(value)}/>
      </Text>
    </Box>
  );
}
