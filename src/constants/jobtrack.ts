// Keep the light palette and status colors aligned with the web application's CSS.
export const JobTrackColors = {
  light: {
    page: '#f3f6fb', surface: '#ffffff', ink: '#172554', muted: '#52627a',
    line: '#dbe3ee', primary: '#2563eb', soft: '#eff4fb',
    error: '#991b1b', errorBackground: '#fef2f2', success: '#166534', successBackground: '#f0fdf4',
  },
  dark: {
    page: '#0f172a', surface: '#1e293b', ink: '#f1f5f9', muted: '#cbd5e1',
    line: '#475569', primary: '#2563eb', soft: '#334155',
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
