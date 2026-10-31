import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { readApiError } from '@/utils/api-error';

// Refresh on navigation and retry, cancelling work when the screen loses focus.
export function useFocusedResource<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const controllerRef = useRef<AbortController | null>(null);

  const reload = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(await readApiError(response, 'Kunde inte hämta uppgifterna. Försök igen.'));
      const result: T = await response.json();
      if (!controller.signal.aborted) setData(result);
    } catch (error) {
      if (!controller.signal.aborted) setError(error instanceof Error && error.name !== 'TypeError'
        ? error.message : 'Kunde inte nå servern. Kontrollera anslutningen och försök igen.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [url]);

  useFocusEffect(useCallback(() => {
    void reload();
    return () => controllerRef.current?.abort();
  }, [reload]));

  return { data, loading, error, reload };
}
