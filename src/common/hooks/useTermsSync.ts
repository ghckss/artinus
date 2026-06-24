import { useCallback, useMemo, useState } from 'react';
import type { TermConfig } from '@/config/serviceTypes';

export function useTermsSync(terms: TermConfig[]) {
  const initialState = useMemo(
    () => terms.reduce<Record<string, boolean>>((acc, term) => ({ ...acc, [term.key]: false }), {}),
    [terms]
  );

  const [termState, setTermState] = useState<Record<string, boolean>>(initialState);

  const allChecked = useMemo(
    () => terms.every((term) => termState[term.key]),
    [termState, terms]
  );

  const requiredChecked = useMemo(
    () => terms.filter((term) => term.required).every((term) => termState[term.key]),
    [termState, terms]
  );

  const toggleTerm = useCallback((key: string, checked: boolean) => {
    setTermState((current) => ({ ...current, [key]: checked }));
  }, []);

  const toggleAll = useCallback((checked: boolean) => {
    setTermState((current) => {
      const next: Record<string, boolean> = {};
      terms.forEach((term) => {
        next[term.key] = checked;
      });
      return next;
    });
  }, [terms]);

  return {
    termState,
    allChecked,
    requiredChecked,
    toggleTerm,
    toggleAll
  };
}
