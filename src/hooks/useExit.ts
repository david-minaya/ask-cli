import { useEffect, useState } from 'react';

export function useExit() {

  const state = useState(false);

  useEffect(() => {
    process.on('SIGINT', () => {
      const set = state[1];
      set(true);
    });
  }, []);

  useEffect(() => {
    if (state[0]) {
      setTimeout(() => process.exit(0), 0);
    }
  }, [state[0]]);

  return state;
}
