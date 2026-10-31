import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';

export function FeedbackPanel({ message, kind = 'info', onRetry }: {
  message: string; kind?: 'loading' | 'error' | 'info'; onRetry?: () => void;
}) {
  const theme = useJobTrackTheme();
  return (
    <View style={[styles.panel, { backgroundColor: kind === 'error' ? theme.errorBackground : theme.surface, borderColor: theme.line }]}
      accessibilityLiveRegion="polite" accessibilityRole={kind === 'error' ? 'alert' : undefined}>
      {kind === 'loading' && <ActivityIndicator color={theme.primary} accessibilityLabel="Laddar" />}
      <Text style={[styles.message, { color: kind === 'error' ? theme.error : theme.muted }]}>{message}</Text>
      {onRetry && <Pressable onPress={onRetry} accessibilityRole="button" style={[styles.retry, { backgroundColor: theme.soft }]}>
        <Text style={{ color: theme.ink, fontWeight: '600' }}>Försök igen</Text>
      </Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { padding: 20, borderRadius: 14, borderWidth: 1, marginBottom: 16, gap: 12, alignItems: 'center' },
  message: { fontSize: 15, lineHeight: 23, textAlign: 'center' },
  retry: { minHeight: 44, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
});
