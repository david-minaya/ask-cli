import { useEffect, useState } from 'react';
import { Box, render, Text, useApp, useInput } from 'ink';
import { SelectModel } from '../components/selectModel.tsx';
import { Model } from '../types/model.ts';

export function selectModel() {
  render(<Select/>);
}

function Select() {

  const { exit } = useApp();

  const [view, setView] = useState<'select-model' | 'selected-model' | 'none'>('select-model');
  const [model, setModel] = useState<Model>();

  useInput((_, key) => {
    if (key.escape) {
      setView('none');
    }
  });

  useEffect(() => {
    if (view === 'none' || view === 'selected-model') {
      exit();
    }
  }, [view]);

  function handleSelect(model: Model) {
    setModel(model);
    setView('selected-model');
  }

  return (
    <Box flexDirection='column'>
      {view === 'select-model' &&
        <SelectModel onSelect={handleSelect}/>
      }
      {view === 'selected-model' &&
        <Text>Selected model: <Text bold color='cyanBright'>{model!.title}</Text></Text>
      }
    </Box>
  );
}
