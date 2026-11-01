import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApplicationStatistics } from '@/components/application-statistics';
import { FeedbackPanel } from '@/components/feedback-panel';
import { WorkspaceHeader } from '@/components/workspace-header';
import { useFocusedResource } from '@/hooks/use-focused-resource';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';
import { API_BASE_URL } from '@/services/auth-client';
import type { EventApplication } from '@/utils/upcoming-events';
import { UpcomingEvents } from '@/components/upcoming-events';
import { useToday } from '@/hooks/use-today';

export default function OverviewScreen() {
  const theme = useJobTrackTheme();
  const today = useToday();
  const { data, loading, error, reload } = useFocusedResource<EventApplication[]>(`${API_BASE_URL}/api/JobApplications`);
  const hasLoaded = data !== null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.page }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <WorkspaceHeader current="overview" />
        <Text accessibilityRole="header" style={[styles.heading, { color: theme.ink }]}>Översikt</Text>
        <Text style={[styles.introduction, { color: theme.muted }]}>Följ ditt jobbsökande och se hur dina ansökningar utvecklas.</Text>
        <Link href="/applications" replace asChild>
          <Pressable accessibilityRole="link" style={{ ...styles.link, backgroundColor: theme.primary }}>
            <Text style={styles.linkText}>Visa mina jobbansökningar →</Text>
          </Pressable>
        </Link>
        {loading && <FeedbackPanel kind="loading" message={hasLoaded ? 'Uppdaterar statistik…' : 'Laddar din statistik…'} />}
        {!!error && <FeedbackPanel kind="error" message={error + (hasLoaded ? ' Senast hämtade uppgifter visas.' : '')} onRetry={() => { void reload(); }} />}
        <ApplicationStatistics applications={data ?? []} loading={!hasLoaded} unavailable={!!error && !hasLoaded}>
          <UpcomingEvents applications={data ?? []} today={today} loading={!hasLoaded} unavailable={!!error && !hasLoaded} />
        </ApplicationStatistics>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, width: '100%', maxWidth: 740, alignSelf: 'center' },
  heading: { fontSize: 28, lineHeight: 36, fontWeight: '700', marginBottom: 8 },
  introduction: { fontSize: 14, lineHeight: 22, marginBottom: 16 },
  link: { padding: 14, minHeight: 48, alignItems: 'center', borderRadius: 10, marginBottom: 28 },
  linkText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
});
