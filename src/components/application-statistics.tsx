import { StyleSheet, Text, View } from 'react-native';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';
import { applicationStatistics, type StatisticsApplication } from '@/utils/application-statistics';

const metrics = [
  { label: 'Intresserad', status: 'Intresserad', color: '#64748b' },
  { label: 'Ansökta', status: 'Ansökt', color: '#2563eb' },
  { label: 'Intervjuer', status: 'Intervju', color: '#d97706' },
  { label: 'Erbjudanden', status: 'Erbjudande', color: '#16a34a' },
  { label: 'Avslag', status: 'Avslag', color: '#dc2626' },
];

export function ApplicationStatistics({ applications, loading, unavailable }: {
  applications: readonly StatisticsApplication[]; loading: boolean; unavailable: boolean;
}) {
  const theme = useJobTrackTheme();
  const stats = applicationStatistics(applications);
  const ready = !loading && !unavailable;
  const difference = stats.thisMonth - stats.previousMonth;
  const comparison = difference === 0 ? 'Lika många som förra månaden' : `${Math.abs(difference)} ${difference > 0 ? 'fler' : 'färre'} än förra månaden`;
  const cards = [{ label: 'Totalt', value: stats.total, color: theme.ink },
    ...metrics.map(metric => ({ ...metric, value: stats.counts[metric.status] }))];
  return (
    <View style={styles.section}>
      <Text style={[styles.eyebrow, { color: theme.muted }]}>DITT JOBBSÖKANDE I SIFFROR</Text>
      <Text accessibilityRole="header" style={[styles.heading, { color: theme.ink }]}>Din statistik</Text>
      <Text style={[styles.note, { color: theme.muted }]}>Alla dina registrerade jobb. Status visar nuläget.</Text>
      {unavailable && <Text style={[styles.note, { color: theme.muted }]}>Statistiken visas när ansökningarna har hämtats.</Text>}
      <View style={styles.cards}>
        {cards.map(card => <View key={card.label} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line, borderTopColor: card.color }]}>
          <Text style={{ color: theme.muted, fontSize: 13 }}>{card.label}</Text>
          <Text style={[styles.number, { color: theme.ink }]}>{ready ? card.value : '—'}</Text>
          <Text style={{ color: theme.muted, fontSize: 11 }}>{card.label === 'Totalt' ? 'Registrerade jobb' : 'Nuvarande status'}</Text>
        </View>)}
      </View>
      <View style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <Text accessibilityRole="header" style={[styles.chartHeading, { color: theme.ink }]}>Ansökningar över tid</Text>
        <Text style={[styles.note, { color: theme.muted }]}>Ansökningsdatum · senaste sex månaderna</Text>
        <View style={[styles.summary, { backgroundColor: theme.soft }]}>
          <Text style={[styles.number, { color: theme.ink }]}>{ready ? stats.thisMonth : '—'}</Text>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: theme.ink, fontSize: 13 }}>den här månaden</Text>
            {ready && <Text style={{ color: theme.muted, fontSize: 12 }}>{comparison}</Text>}
          </View>
        </View>
        {ready ? <>
          {stats.months.every(month => month.count === 0) && <Text style={[styles.note, { color: theme.muted }]}>Inga daterade ansökningar under perioden ännu.</Text>}
          <View style={styles.chart}>
            {stats.months.map(month => <View key={month.key} accessible accessibilityLabel={`${month.label}: ${month.count} ansökningar`} style={styles.row}>
              <Text style={[styles.month, { color: theme.muted }]}>{month.label}</Text>
              <View style={[styles.track, { backgroundColor: theme.soft }]}>
                <View style={{ height: '100%', width: `${month.count / stats.maximum * 100}%`, backgroundColor: theme.primary, borderRadius: 4 }} />
              </View>
              <Text style={[styles.count, { color: theme.ink }]}>{month.count}</Text>
            </View>)}
          </View>
          <Text style={[styles.note, { color: theme.muted }]}>Räknas efter ansökningsdatum, även om status ändrats. Intresserade jobb ingår inte.</Text>
          {(stats.undated > 0 || stats.future > 0) && <Text style={[styles.note, { color: theme.muted }]}>Utanför diagrammet: {stats.undated} utan giltigt ansökningsdatum och {stats.future} med framtida datum.</Text>}
        </> : <Text style={[styles.note, { color: theme.muted }]}>{unavailable ? 'Diagrammet är inte tillgängligt just nu.' : 'Hämtar din statistik…'}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 28 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginBottom: 6 },
  heading: { fontSize: 23, lineHeight: 32, fontWeight: '700', marginBottom: 6 },
  note: { fontSize: 12, lineHeight: 19, marginBottom: 8 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12, marginBottom: 16 },
  card: { flexBasis: '46%', flexGrow: 1, borderWidth: 1, borderTopWidth: 3, borderRadius: 14, padding: 16, gap: 4 },
  number: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
  panel: { borderWidth: 1, borderRadius: 14, padding: 18 },
  chartHeading: { fontSize: 17, lineHeight: 24, fontWeight: '700', marginBottom: 6 },
  summary: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, gap: 12, marginVertical: 8 },
  chart: { gap: 14, marginVertical: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  month: { width: 82, fontSize: 12 },
  track: { height: 14, borderRadius: 4, overflow: 'hidden', flex: 1 },
  count: { minWidth: 24, fontSize: 12, fontWeight: '700', textAlign: 'right' },
});
