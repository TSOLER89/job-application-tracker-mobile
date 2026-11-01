import { Link } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OverviewSummary } from '@/components/overview-summary';
import { FeedbackPanel } from '@/components/feedback-panel';
import { WorkspaceHeader } from '@/components/workspace-header';
import { WorkspaceNavigation } from '@/components/workspace-navigation';
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
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading && hasLoaded} onRefresh={() => { void reload(); }} tintColor={theme.primary} colors={[theme.primary]} />}>
        <WorkspaceHeader />
        <View style={styles.titleRow}>
          <Text accessibilityRole="header" style={[styles.heading, { color: theme.ink }]}>Översikt</Text>
          <Link href="/application/new" asChild>
            <Pressable accessibilityRole="link" accessibilityLabel="Lägg till ansökan" style={{ ...styles.quickAdd, backgroundColor: theme.primary }}>
              <Text style={styles.plus}>+</Text>
            </Pressable>
          </Link>
        </View>
        <Text style={[styles.introduction, { color: theme.muted }]}>Det viktigaste för ditt jobbsökande.</Text>
        {loading && <FeedbackPanel kind="loading" message={hasLoaded ? 'Uppdaterar översikten…' : 'Laddar din översikt…'} />}
        {!!error && <FeedbackPanel kind="error" message={error + (hasLoaded ? ' Senast hämtade uppgifter visas.' : '')} onRetry={() => { void reload(); }} />}
        <OverviewSummary applications={data ?? []} loading={!hasLoaded} unavailable={!!error && !hasLoaded} />
        <UpcomingEvents applications={data ?? []} today={today} loading={!hasLoaded} unavailable={!!error && !hasLoaded} />
        <Link href="/statistics" replace asChild>
          <Pressable accessibilityRole="link" style={{ ...styles.link, backgroundColor: theme.soft }}>
            <Text style={{ color: theme.ink, fontSize: 13, fontWeight: '600' }}>Visa all statistik →</Text>
          </Pressable>
        </Link>
      </ScrollView>
      <WorkspaceNavigation current="overview" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, width: '100%', maxWidth: 740, alignSelf: 'center' },
  heading: { fontSize: 30, lineHeight: 38, fontWeight: '700', letterSpacing: -1, marginBottom: 5 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 3 },
  quickAdd: { width: 44, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  plus: { color: '#fff', fontSize: 28, lineHeight: 34, fontWeight: '400' },
  introduction: { fontSize: 14, lineHeight: 22, marginBottom: 16 },
  link: { padding: 12, minHeight: 44, alignItems: 'center', borderRadius: 10 },
});
