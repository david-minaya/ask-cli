import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { Provider } from '../types/provider.ts';

interface Props {
  type: Provider['type'];
  testing: boolean;
  error?: string;
}

export function TestProvider(props: Props) {

  const {
    type,
    testing,
    error
  } = props;

  return (
    <Box>
      {testing &&
        <Box marginTop={1}>
          <Text>
            <Text>
              {type === 'openai-compatible'
                ? 'Connecting'
                : 'Validating API key'
              }
            </Text>
            <Spinner type='simpleDots'/>
          </Text>
        </Box>
      }
      {error &&
        <Box marginTop={1}>
          <Text color='red'>
            <Text>
              {type === 'openai-compatible'
                ? 'Incorrect url or API key: '
                : 'Invalid API key: '
              }
            </Text>
            <Text color='redBright'>
              <Text>{error.slice(0, 500)}</Text>
              {error.length > 500 && <Text>...</Text>}
            </Text></Text>
        </Box>
      }
    </Box>
  );
}
