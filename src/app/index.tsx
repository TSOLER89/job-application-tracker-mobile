import { useFocusedResource } from '@/hooks/use-focused-resource';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedbackPanel } from '@/components/feedback-panel';
import { StatusBadge } from '@/components/status-badge';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
type JobApplication = { id: number; company: string; position: string; location: string; status: string };

export default function HomeScreen() {
  const router = useRouter();
  const theme = useJobTrackTheme();
  const { data, loading, error, reload } = useFocusedResource<JobApplication[]>(`${API_BASE_URL}/api/JobApplications`);
  const applications = data ?? [];
  const hasLoaded = data !== null;

  const stats = [
    { label: 'Totalt', value: applications.length, color: '#2563eb' },
    { label: 'Intervjuer', value: applications.filter(a => a.status === 'Intervju').length, color: '#d97706' },
    { label: 'Erbjudanden', value: applications.filter(a => a.status === 'Erbjudande').length, color: '#16a34a' },
    { label: 'Avslag', value: applications.filter(a => a.status === 'Avslag').length, color: '#dc2626' },
  ];

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.page }]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>DIN KARRIÄR, ETT STEG I TAGET</Text>
          <Text style={styles.brand} accessibilityRole="header">JobTrack</Text>
          <Text style={styles.subtitle}>Dina ansökningar. Samlade på ett ställe.</Text>
        </View>
        <View style={styles.stats}>
          {stats.map(stat => <View key={stat.label} style={[styles.stat, { backgroundColor: theme.surface, borderColor: theme.line, borderTopColor: stat.color }]}>
            <Text style={{ color: theme.muted, fontSize: 13 }}>{stat.label}</Text>
            <Text style={[styles.number, { color: theme.ink }]}>{hasLoaded ? stat.value : '—'}</Text>
          </View>)}
        </View>
        <Text style={[styles.sectionEyebrow, { color: theme.muted }]}>DIN ÖVERSIKT</Text>
        <Text style={[styles.heading, { color: theme.ink }]} accessibilityRole="header">Mina jobbansökningar</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push('/application/new')} style={[styles.addButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.addText}>+ Lägg till ansökan</Text>
        </Pressable>
        {loading && <FeedbackPanel kind="loading" message={hasLoaded ? 'Uppdaterar ansökningar…' : 'Laddar dina ansökningar…'} />}
        {!!error && <FeedbackPanel kind="error" message={error + (hasLoaded ? ' Senast hämtade uppgifter visas.' : '')} onRetry={() => { void reload(); }} />}
        {hasLoaded && !loading && !error && applications.length === 0 && <FeedbackPanel message="Inga jobbansökningar ännu. Lägg till din första ansökan för att komma igång." />}
        {applications.map(application => (
          <Pressable key={application.id} accessibilityRole="button" accessibilityLabel={`${application.company}, ${application.position}, ${application.status}. Visa detaljer.`}
            onPress={() => router.push({ pathname: '/application/[id]', params: { id: String(application.id) } })}
            style={({ pressed }) => [styles.card, { backgroundColor: theme.surface, borderColor: theme.line, opacity: pressed ? 0.75 : 1 }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.company, { color: theme.ink }]}>{application.company}</Text>
              <StatusBadge status={application.status} />
            </View>
            <Text style={[styles.position, { color: theme.muted }]}>{application.position}</Text>
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
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, width: '100%', maxWidth: 740, alignSelf: 'center' },
  hero: { backgroundColor: '#172554', borderBottomWidth: 4, borderBottomColor: '#2563eb', borderRadius: 16, padding: 24, marginBottom: 20 },
  eyebrow: { color: '#bfdbfe', fontSize: 10, fontWeight: '700', letterSpacing: 1.2, lineHeight: 16 },
  brand: { fontSize: 36, lineHeight: 44, fontWeight: '700', color: '#ffffff', marginTop: 8 },
  subtitle: { color: '#dbeafe', fontSize: 15, lineHeight: 23, marginTop: 8 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  stat: { flexBasis: '46%', flexGrow: 1, borderWidth: 1, borderTopWidth: 3, borderRadius: 14, padding: 16, gap: 4 },
  number: { fontSize: 28, lineHeight: 36, fontWeight: '700' },
  sectionEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1.4, marginBottom: 6 },
  heading: { fontSize: 23, lineHeight: 32, fontWeight: '700', marginBottom: 18 },
  addButton: { padding: 14, minHeight: 48, alignItems: 'center', borderRadius: 10, marginBottom: 24 },
  addText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  card: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 14 },
  cardHeader: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12, justifyContent: 'space-between' },
  company: { fontSize: 19, lineHeight: 27, fontWeight: '700', flexGrow: 1, flexShrink: 1 },
  position: { fontSize: 15, lineHeight: 23, marginTop: 8 },
  cardFooter: { borderTopWidth: 1, marginTop: 18, paddingTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  location: { fontSize: 14, flexShrink: 1 },
});
