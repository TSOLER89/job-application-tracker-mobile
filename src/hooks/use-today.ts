import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { todayKey } from '@/utils/planning-notices';

export function useToday() {
  const [today, setToday] = useState(todayKey);
  useFocusEffect(useCallback(() => { setToday(todayKey()); }, []));
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function schedule() {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(refresh, next.getTime() - now.getTime() + 50);
    }
    function refresh() {
      setToday(todayKey());
      clearTimeout(timer);
      schedule();
    }
    schedule();
    const subscription = AppState.addEventListener('change', state => { if (state === 'active') refresh(); });
    return () => { clearTimeout(timer); subscription.remove(); };
  }, []);
  return today;
}
