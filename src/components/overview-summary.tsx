import { StyleSheet, Text, View } from 'react-native';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';
import { applicationStatistics, type StatisticsApplication } from '@/utils/application-statistics';
import { AppGlyph, type GlyphName } from '@/components/app-glyph';

export function OverviewSummary({ applications, loading, unavailable }: {
  applications: readonly StatisticsApplication[]; loading: boolean; unavailable: boolean;
}) {
  const theme = useJobTrackTheme();
  const stats = applicationStatistics(applications);
  const ready = !loading && !unavailable;
  const cards = [{ label: 'Totalt', value: stats.total }, { label: 'Ansökta', value: stats.counts['Ansökt'] },
    { label: 'Intervjuer', value: stats.counts.Intervju }, { label: 'Erbjudanden', value: stats.counts.Erbjudande }];
  return <View style={styles.grid}>
    {cards.map((card, index) => <View key={card.label} accessible accessibilityLabel={`${card.label}: ${ready ? card.value : '—'}`} style={[styles.card, { backgroundColor: index === 0 ? '#242b43' : theme.surface, borderColor: index === 0 ? '#242b43' : theme.line }]}>
      <View style={styles.cardTop}><Text style={[styles.label, { color: index === 0 ? '#ead1bd' : theme.muted }]}>{card.label}</Text><AppGlyph name={(['overview', 'applications', 'statistics', 'offers'] as GlyphName[])[index]} color={index === 0 ? '#f0c29e' : theme.accent} size={17} /></View>
      <Text style={[styles.number, { color: index === 0 ? '#fff' : theme.ink }]}>{ready ? card.value : '—'}</Text>
    </View>)}
  </View>;
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  card: { flexBasis: '46%', flexGrow: 1, borderWidth: 1, borderRadius: 18, padding: 16, gap: 8 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  label: { fontSize: 12 },
  number: { fontSize: 28, lineHeight: 33, fontWeight: '700', letterSpacing: -0.8 },
});
