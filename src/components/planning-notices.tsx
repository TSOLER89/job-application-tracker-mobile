import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { planningNotices, type PlanningApplication } from '@/utils/planning-notices';

const colors = {
  light: { urgent: { backgroundColor: '#fef2f2', color: '#991b1b' }, warning: { backgroundColor: '#fffbeb', color: '#92400e' }, neutral: { backgroundColor: '#eff6ff', color: '#1e40af' } },
  dark: { urgent: { backgroundColor: '#450a0a', color: '#fecaca' }, warning: { backgroundColor: '#451a03', color: '#fde68a' }, neutral: { backgroundColor: '#172554', color: '#bfdbfe' } },
};

export function PlanningNotices({ application, today }: { application: PlanningApplication; today: string }) {
  const palette = colors[useColorScheme() === 'dark' ? 'dark' : 'light'];
  const notices = planningNotices(application, today);
  if (!notices.length) return null;
  return <View style={styles.notices}>{notices.map(notice =>
    <View key={notice.kind} style={[styles.notice, { backgroundColor: palette[notice.tone].backgroundColor }]}>
      <Text style={[styles.text, { color: palette[notice.tone].color }]}>{notice.label}</Text>
    </View>)}</View>;
}

const styles = StyleSheet.create({
  notices: { gap: 8, marginVertical: 14 },
  notice: { borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12 },
  text: { fontSize: 13, lineHeight: 20, fontWeight: '600', flexShrink: 1 },
});
