import { useEffect, useState } from 'react';
import { Box, render, Text } from 'ink';
import { SelectModel } from '../components/selectModel.tsx';
import { Model } from '../types/model.ts';
import { Provider } from '../types/provider.ts';

export function selectModel() {
  render(<Select/>);
}

function Select() {

  const [provider, setProvider] = useState<Provider>();
  const [model, setModel] = useState<Model>();

  useEffect(() => {
    if (model) {
      setTimeout(() => process.exit(), 0);
    }
  }, [model]);

  function handleSelect(provider: Provider, model: Model) {
    setProvider(provider);
    setModel(model);
  }

  return (
    <Box flexDirection='column'>
      {!model &&
        <SelectModel onSelect={handleSelect}/>
      }
      {model &&
        <Text>Selected model: <Text bold color='cyanBright'>({provider?.name}) {model?.name}</Text></Text>
      }
    </Box>
  );
}
