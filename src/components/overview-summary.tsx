import { StyleSheet, Text, View } from 'react-native';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';
import { applicationStatistics, type StatisticsApplication } from '@/utils/application-statistics';

export function OverviewSummary({ applications, loading, unavailable }: {
  applications: readonly StatisticsApplication[]; loading: boolean; unavailable: boolean;
}) {
  const theme = useJobTrackTheme();
  const stats = applicationStatistics(applications);
  const ready = !loading && !unavailable;
  const cards = [{ label: 'Totalt', value: stats.total }, { label: 'Ansökta', value: stats.counts['Ansökt'] },
    { label: 'Intervjuer', value: stats.counts.Intervju }, { label: 'Erbjudanden', value: stats.counts.Erbjudande }];
  return <View style={styles.grid}>
    {cards.map(card => <View key={card.label} accessible accessibilityLabel={`${card.label}: ${ready ? card.value : '—'}`} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
      <Text style={[styles.label, { color: theme.muted }]}>{card.label}</Text>
      <Text style={[styles.number, { color: theme.ink }]}>{ready ? card.value : '—'}</Text>
    </View>)}
  </View>;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  card: { flexBasis: '46%', flexGrow: 1, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, gap: 3 },
  label: { fontSize: 12 },
  number: { fontSize: 25, lineHeight: 30, fontWeight: '700' },
});
