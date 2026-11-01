import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedbackPanel } from '@/components/feedback-panel';
import { StatusBadge } from '@/components/status-badge';
import { WorkspaceHeader } from '@/components/workspace-header';
import { useFocusedResource } from '@/hooks/use-focused-resource';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';
import { API_BASE_URL } from '@/services/auth-client';
import { useToday } from '@/hooks/use-today';
import { PlanningNotices } from '@/components/planning-notices';
import { planningNotices } from '@/utils/planning-notices';

type JobApplication = { id: number; company: string; position: string; location: string; status: string; applicationDeadline: string | null; followUpDate: string | null };

export default function ApplicationsScreen() {
  const router = useRouter();
  const theme = useJobTrackTheme();
  const today = useToday();
  const { data, loading, error, reload } = useFocusedResource<JobApplication[]>(`${API_BASE_URL}/api/JobApplications`);
  const applications = data ?? [];
  const hasLoaded = data !== null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.page }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <WorkspaceHeader current="applications" />
        <Text style={[styles.sectionEyebrow, { color: theme.muted }]}>DINA SPARADE JOBB</Text>
        <Text style={[styles.heading, { color: theme.ink }]} accessibilityRole="header">Mina jobbansökningar</Text>
        {hasLoaded && <Text style={{ color: theme.muted, fontSize: 13, marginBottom: 18 }}>{applications.length} registrerade jobb</Text>}
        <Pressable accessibilityRole="button" onPress={() => router.push('/application/new')} style={[styles.addButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.addText}>+ Lägg till ansökan</Text>
        </Pressable>
        {loading && <FeedbackPanel kind="loading" message={hasLoaded ? 'Uppdaterar ansökningar…' : 'Laddar dina ansökningar…'} />}
        {!!error && <FeedbackPanel kind="error" message={error + (hasLoaded ? ' Senast hämtade uppgifter visas.' : '')} onRetry={() => { void reload(); }} />}
        {hasLoaded && !loading && !error && applications.length === 0 && <FeedbackPanel message="Inga jobbansökningar ännu. Lägg till din första ansökan för att komma igång." />}
        {applications.map(application => (
          <Pressable key={application.id} accessibilityRole="button" accessibilityLabel={`${application.company}, ${application.position}, ${application.status}${planningNotices(application, today).map(notice => ', ' + notice.label).join('')}. Visa detaljer.`}
            onPress={() => router.push({ pathname: '/application/[id]', params: { id: String(application.id) } })}
            style={({ pressed }) => [styles.card, { backgroundColor: theme.surface, borderColor: theme.line, opacity: pressed ? 0.75 : 1 }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.company, { color: theme.ink }]}>{application.company}</Text>
              <StatusBadge status={application.status} />
            </View>
            <Text style={[styles.position, { color: theme.muted }]}>{application.position}</Text>
            <PlanningNotices application={application} today={today} />
            {application.applicationDeadline && <Text style={[styles.position, { color: theme.muted }]}>Sista ansökningsdag: {application.applicationDeadline}</Text>}
            {application.followUpDate && <Text style={[styles.position, { color: theme.muted }]}>Uppföljning: {application.followUpDate}</Text>}
            <View style={[styles.cardFooter, { borderColor: theme.line }]}>
              <Text style={[styles.location, { color: theme.muted }]}>{application.location}</Text>
              <Text style={{ color: theme.ink, fontSize: 13, fontWeight: '600' }}>Visa detaljer →</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, width: '100%', maxWidth: 740, alignSelf: 'center' },
  sectionEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4, marginBottom: 6 },
  heading: { fontSize: 23, lineHeight: 32, fontWeight: '700', marginBottom: 12 },
  addButton: { padding: 14, minHeight: 48, alignItems: 'center', borderRadius: 10, marginBottom: 24 },
  addText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  card: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12, justifyContent: 'space-between' },
  company: { fontSize: 19, lineHeight: 27, fontWeight: '700', flexGrow: 1, flexShrink: 1 },
  position: { fontSize: 15, lineHeight: 23, marginTop: 8 },
  cardFooter: { borderTopWidth: 1, marginTop: 18, paddingTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  location: { fontSize: 14, flexShrink: 1 },
});
