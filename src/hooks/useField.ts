import { useState, useCallback, useMemo } from 'react';

export interface Field {
  label?: string;
  value?: string;
  focus?: boolean;
  placeholder?: string;
  error?: string;
}

export function useField(field: Field = {}) {

  const [state, setState] = useState(field);

  const set = useCallback((field: Partial<Field>) => {
    setState(state => ({ ...state, ...field }));
  }, []);

  return useMemo(() => ({ 
    get label() { return state.label; },
    get placeholder() { return state.placeholder; },
    get value() { return state.value ?? ''; },
    get error() { return state.error; },
    get focus() { return state.focus; },
    set value(value: string) { set({ value }); },
    set focus(focus: boolean | undefined) { set({ focus }); },
    set error(error: string | undefined) { set({ error }); },
    change(value: string) { set({ value }); },
    set
  }), [state, set]);
}
