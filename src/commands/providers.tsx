import { Box, render } from 'ink';
import { useState } from 'react';
import { Providers } from '../components/providers.tsx';
import { Provider as ProviderType } from '../types/provider.ts';
import { Provider } from '../components/provider.tsx';

export function providers() {
  render(<Providers2/>);
}

function Providers2() {

  const [view, setView] = useState<'providers' | 'provider' | 'none'>('providers');
  const [selectedProvider, setSelectedProvider] = useState<ProviderType>();

  function onSelectProvider(provider: ProviderType) {
    setSelectedProvider(provider);
    setView('provider');
  }

  return (
    <Box>
      {view === 'providers' && 
        <Providers onSelect={onSelectProvider}/>
      }
      {view === 'provider' && selectedProvider &&
        <Provider 
          provider={selectedProvider} 
          onClose={() => setView('providers')}/>
      }
    </Box>
  );
}
