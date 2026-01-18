import { Box, Text } from 'ink';
import { TextField } from './textField.tsx';

interface Props {
  title: string;
  value: string;
  onChange: (apiKey: string) => void;
}

export function ApiKeyField(props: Props) {

  const { 
    title,
    value,
    onChange 
  } = props;

  return (
    <Box flexDirection='column'>
      <Text bold>{title}</Text>
      <Box flexShrink={0}>
      </Box>
      <Box 
        flexDirection='row'
        gap={1}
        borderStyle='single' 
        borderLeftColor='cyan'
        borderLeft={true} 
        borderRight={false} 
        borderTop={false} 
        borderBottom={false}
        paddingLeft={1}
        marginTop={1}>
        <Box flexShrink={0}>
          <Text>Api key:</Text>
        </Box>
        <TextField
          value={value}
          placeholder='Enter api key'
          onChange={onChange}/>
      </Box>
    </Box>
  );
}
