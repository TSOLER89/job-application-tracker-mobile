import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';
import { upcomingEvents, type EventApplication } from '@/utils/upcoming-events';

const sections = [
  { key: 'attention', title: 'Behöver din uppmärksamhet', description: 'Idag och passerade datum, äldst först.', empty: 'Inga deadlines eller uppföljningar att ta hand om idag.' },
  { key: 'upcoming', title: 'Kommande händelser', description: 'Dina närmaste planerade datum.', empty: 'Inga kommande datum. Lägg till en deadline eller uppföljning på ett jobb.' },
] as const;

export function UpcomingEvents({ applications, today, loading, unavailable }: {
  applications: readonly EventApplication[]; today: string; loading: boolean; unavailable: boolean;
}) {
  const theme = useJobTrackTheme();
  const groups = upcomingEvents(applications, today);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const ready = !loading && !unavailable;
  return <View style={styles.groups}>
    {sections.map(section => {
      const events = groups[section.key];
      const visible = expanded[section.key] ? events : events.slice(0, 3);
      return <View key={section.key} style={[styles.panel, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.ink }]}>{section.title}</Text>
          <Text accessibilityLabel="Antal händelser" style={[styles.count, { color: theme.muted, borderColor: theme.line }]}>{ready ? events.length : '—'}</Text>
        </View>
        {!ready ? <Text style={[styles.empty, { color: theme.muted, backgroundColor: theme.soft }]}>{unavailable ? 'Händelserna visas när ansökningarna har hämtats.' : 'Hämtar dina planerade händelser…'}</Text>
          : events.length === 0 ? <Text style={[styles.empty, { color: theme.muted, backgroundColor: theme.soft }]}>{section.empty}</Text>
          : <>
            <View style={styles.list}>
              {visible.map(event => <Link key={`${event.id}-${event.kind}`} href={{ pathname: '/application/[id]', params: { id: String(event.id) } }} asChild>
                <Pressable accessibilityRole="link" accessibilityLabel={`${event.company}, ${event.position}. ${event.label}. ${event.date}. Visa ansökan.`} style={{
                  ...styles.event, borderColor: theme.line,
                  borderLeftColor: event.tone === 'urgent' ? theme.error : event.tone === 'warning' ? '#d97706' : theme.primary,
                }}>
                  <Text style={[styles.company, { color: theme.ink }]}>{event.company}</Text>
                  <Text numberOfLines={1} style={[styles.small, { color: theme.muted }]}>{event.position}</Text>
                  <Text style={[styles.label, { color: event.tone === 'urgent' ? theme.error : theme.ink }]}>{event.label}</Text>
                  <View style={styles.footer}>
                    <Text style={[styles.small, { color: theme.muted }]}>{event.date}</Text>
                    <Text style={[styles.open, { color: theme.ink }]}>Visa →</Text>
                  </View>
                </Pressable>
              </Link>)}
            </View>
            {events.length > 3 && <Pressable accessibilityRole="button" accessibilityState={{ expanded: !!expanded[section.key] }} onPress={() => setExpanded(current => ({ ...current, [section.key]: !current[section.key] }))} style={[styles.more, { backgroundColor: theme.soft }]}>
              <Text style={{ color: theme.ink, fontWeight: '600' }}>{expanded[section.key] ? 'Visa färre' : `Visa alla (${events.length})`}</Text>
            </Pressable>}
          </>}
      </View>;
    })}
  </View>;
}

const styles = StyleSheet.create({
  groups: { gap: 16, marginBottom: 24 },
  panel: { borderWidth: 1, borderRadius: 14, padding: 18 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'space-between', marginBottom: 14 },
  title: { fontSize: 16, lineHeight: 23, fontWeight: '700', flexShrink: 1 },
  count: { borderWidth: 1, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 9, fontSize: 12, fontWeight: '700' },
  empty: { fontSize: 13, lineHeight: 21, padding: 14, borderRadius: 10 },
  list: { gap: 12 },
  event: { borderWidth: 1, borderLeftWidth: 3, borderRadius: 10, padding: 12, gap: 3 },
  company: { fontSize: 15, fontWeight: '700' },
  small: { fontSize: 12, lineHeight: 18 },
  label: { fontSize: 13, lineHeight: 20, fontWeight: '600', marginTop: 5 },
  footer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 5 },
  open: { fontSize: 12, fontWeight: '600' },
  more: { padding: 12, minHeight: 44, alignItems: 'center', borderRadius: 10, marginTop: 16 },
});
