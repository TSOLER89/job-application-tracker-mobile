import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkspaceHeader } from '@/components/workspace-header';
import { WorkspaceNavigation } from '@/components/workspace-navigation';
import { FeedbackPanel } from '@/components/feedback-panel';
import { useFocusedResource } from '@/hooks/use-focused-resource';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';
import { apiFetch, API_BASE_URL } from '@/services/auth-client';
import { readApiError } from '@/utils/api-error';

type MailAccounts = { gmailConfigured: boolean; accounts: { id: string; provider: string; email: string; verifiedAt: string }[] };

export default function EmailAccountsScreen() {
  const theme = useJobTrackTheme();
  const { data, loading, error, reload } = useFocusedResource<MailAccounts>(`${API_BASE_URL}/api/email-connections`);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const [message, setMessage] = useState('');
  async function disconnect(id: string) {
    if (busy) return;
    setBusy(true); setActionError(''); setMessage('');
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/email-connections/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await readApiError(response, 'Kunde inte koppla från mejlkontot.'));
      const result = await response.json();
      setConfirm(null);
      setMessage(result.providerRevoked ? 'Mejlkontot har kopplats från.' : 'Kopplingen är borttagen här. Kontrollera även JobTracks behörighet i ditt Google-konto.');
      await reload();
    } catch (error) { setActionError(error instanceof Error ? error.message : 'Kunde inte nå servern. Försök igen.'); }
    finally { setBusy(false); }
  }
  return <SafeAreaView style={{ flex: 1, backgroundColor: theme.page }} edges={['top', 'left', 'right']}>
    <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading && data !== null} onRefresh={() => { void reload(); }} tintColor={theme.primary} colors={[theme.primary]} />}>
      <WorkspaceHeader />
      <Text accessibilityRole="header" style={[styles.heading, { color: theme.ink }]}>Mejlkonton</Text>
      <Text style={[styles.text, { color: theme.muted }]}>Anslut Gmail från webbappen på datorn. Kontot visas sedan här under samma JobTrack-inloggning.</Text>
      {loading && <FeedbackPanel kind="loading" message="Hämtar mejlkonton…" />}
      {!!error && <FeedbackPanel kind="error" message={error} onRetry={() => { void reload(); }} />}
      {!!actionError && <FeedbackPanel kind="error" message={actionError} />}
      {!!message && <FeedbackPanel message={message} />}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <Text accessibilityRole="header" style={[styles.title, { color: theme.ink }]}>Gmail</Text>
        <Text style={[styles.text, { color: theme.muted }]}>{data && !data.gmailConfigured ? 'Gmail behöver först konfigureras i webbappen och backend.' : 'Google-inloggningen görs på datorn i det här första steget. Återvänd hit eller uppdatera för att se kopplingen.'}</Text>
        <Text style={[styles.text, { color: theme.muted }]}>Mejlimport kommer i nästa steg.</Text>
      </View>
      <Text accessibilityRole="header" style={[styles.title, { color: theme.ink }]}>Anslutna konton</Text>
      {data?.accounts.length === 0 && <FeedbackPanel message="Inga mejlkonton är anslutna ännu." />}
      {data?.accounts.map(account => <View key={account.id} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.line }]}>
        <Text style={[styles.email, { color: theme.ink }]}>{account.email}</Text>
        <Text style={[styles.text, { color: theme.muted }]}>Gmail · Anslutet</Text>
        <Text style={[styles.small, { color: theme.muted }]}>Verifierat {new Date(account.verifiedAt).toLocaleString('sv-SE')}</Text>
        {confirm === account.id ? <>
          <Text style={[styles.text, { color: theme.ink }]}>Koppla från det här mejlkontot?</Text>
          <Pressable accessibilityRole="button" disabled={busy} onPress={() => { void disconnect(account.id); }} style={[styles.button, { backgroundColor: theme.errorBackground }]}><Text style={{ color: theme.error, fontWeight: '600' }}>Bekräfta frånkoppling</Text></Pressable>
          <Pressable accessibilityRole="button" disabled={busy} onPress={() => setConfirm(null)} style={[styles.button, { backgroundColor: theme.soft }]}><Text style={{ color: theme.ink }}>Avbryt</Text></Pressable>
        </> : <Pressable accessibilityRole="button" disabled={busy} onPress={() => setConfirm(account.id)} style={[styles.button, { backgroundColor: theme.soft }]}><Text style={{ color: theme.ink }}>Koppla från</Text></Pressable>}
      </View>)}
      <Text style={[styles.small, { color: theme.muted }]}>Outlook för skolmejlen kommer i nästa etapp.</Text>
    </ScrollView>
    <WorkspaceNavigation current={null} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40, width: '100%', maxWidth: 740, alignSelf: 'center' },
  heading: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 10 },
  text: { fontSize: 14, lineHeight: 23, marginBottom: 12 },
  small: { fontSize: 12, lineHeight: 19 },
  card: { borderWidth: 1, borderRadius: 20, padding: 20, marginVertical: 14 },
  email: { fontSize: 15, lineHeight: 23, fontWeight: '700' },
  button: { minHeight: 44, borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 10 },
});
