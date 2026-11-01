import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApplicationStatistics } from '@/components/application-statistics';
import { FeedbackPanel } from '@/components/feedback-panel';
import { WorkspaceHeader } from '@/components/workspace-header';
import { WorkspaceNavigation } from '@/components/workspace-navigation';
import { useFocusedResource } from '@/hooks/use-focused-resource';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';
import { useToday } from '@/hooks/use-today';
import { API_BASE_URL } from '@/services/auth-client';
import type { StatisticsApplication } from '@/utils/application-statistics';

export default function StatisticsScreen() {
  const theme = useJobTrackTheme();
  // Re-render monthly statistics when the local calendar day changes.
  useToday();
  const { data, loading, error, reload } = useFocusedResource<StatisticsApplication[]>(`${API_BASE_URL}/api/JobApplications`);
  const hasLoaded = data !== null;
  return <SafeAreaView style={{ flex: 1, backgroundColor: theme.page }} edges={['top', 'left', 'right']}>
    <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading && hasLoaded} onRefresh={() => { void reload(); }} tintColor={theme.primary} colors={[theme.primary]} />}>
      <WorkspaceHeader />
      {loading && <FeedbackPanel kind="loading" message={hasLoaded ? 'Uppdaterar statistik…' : 'Laddar din statistik…'} />}
      {!!error && <FeedbackPanel kind="error" message={error + (hasLoaded ? ' Senast hämtade uppgifter visas.' : '')} onRetry={() => { void reload(); }} />}
      <ApplicationStatistics applications={data ?? []} loading={!hasLoaded} unavailable={!!error && !hasLoaded} />
    </ScrollView>
    <WorkspaceNavigation current="statistics" />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, width: '100%', maxWidth: 740, alignSelf: 'center' },
});
