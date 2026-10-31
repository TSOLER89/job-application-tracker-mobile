import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ApplicationStatuses, StatusColors } from '@/constants/jobtrack';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';

export function StatusBadge({ status }: { status: string }) {
  const colors = StatusColors[status] ?? StatusColors.Intresserad;
  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <View style={[styles.dot, { backgroundColor: colors.text }]} />
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
}

export function StatusPicker({ value, onChange, disabled }: {
  value: string; onChange: (status: string) => void; disabled: boolean;
}) {
  const theme = useJobTrackTheme();
  return (
    <View style={styles.options}>
      {ApplicationStatuses.map(status => (
        <Pressable key={status} onPress={() => onChange(status)} disabled={disabled}
          accessibilityRole="radio" accessibilityState={{ checked: value === status, disabled }}
          accessibilityLabel={status}
          style={[styles.option, { borderColor: value === status ? theme.ink : 'transparent', opacity: disabled ? 0.6 : 1 }]}>
          <StatusBadge status={status} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, flexShrink: 0 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 12, fontWeight: '700', lineHeight: 18 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  option: { borderWidth: 2, borderRadius: 24, padding: 3, minHeight: 44, justifyContent: 'center' },
});
