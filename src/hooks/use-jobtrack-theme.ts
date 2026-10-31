import { useColorScheme } from 'react-native';
import { JobTrackColors } from '@/constants/jobtrack';

export function useJobTrackTheme() {
  return JobTrackColors[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
