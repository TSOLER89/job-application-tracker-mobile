// Keep the light palette and status colors aligned with the web application's CSS.
export const JobTrackColors = {
  light: {
    page: '#f6f4f1', surface: '#ffffff', ink: '#222a3b', muted: '#626878',
    line: '#e4e1db', primary: '#9a4b2f', soft: '#f8eee7', accent: '#9a4b2f',
    error: '#991b1b', errorBackground: '#fef2f2', success: '#166534', successBackground: '#f0fdf4',
  },
  dark: {
    page: '#141826', surface: '#202638', ink: '#f5f2ed', muted: '#c4c2cc',
    line: '#3b4256', primary: '#9a4b2f', soft: '#303447', accent: '#f2b88d',
    error: '#fecaca', errorBackground: '#450a0a', success: '#bbf7d0', successBackground: '#052e16',
  },
} as const;

export const ApplicationStatuses = ['Ansökt', 'Intresserad', 'Intervju', 'Erbjudande', 'Avslag'] as const;
export const StatusColors: Record<string, { background: string; text: string }> = {
  Intresserad: { background: '#e5e7eb', text: '#374151' },
  Ansökt: { background: '#dbeafe', text: '#1d4ed8' },
  Intervju: { background: '#fef3c7', text: '#92400e' },
  Erbjudande: { background: '#dcfce7', text: '#166534' },
  Avslag: { background: '#fee2e2', text: '#991b1b' },
};
