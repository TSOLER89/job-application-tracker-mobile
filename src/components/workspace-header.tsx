import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/components/auth-provider';
import { FeedbackPanel } from '@/components/feedback-panel';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';

export function WorkspaceHeader({ current }: { current: 'overview' | 'applications' }) {
  const theme = useJobTrackTheme();
  const auth = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');
  async function logout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setError('');
    try { await auth.logout(); }
    catch (error) { setError(error instanceof Error ? error.message : 'Kunde inte logga ut. Försök igen.'); }
    finally { setIsLoggingOut(false); }
  }
  return <>
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>DIN KARRIÄR, ETT STEG I TAGET</Text>
      <Text style={styles.brand} accessibilityRole="header">JobTrack</Text>
      <Text style={styles.subtitle}>Dina ansökningar. Samlade på ett ställe.</Text>
    </View>
    <View style={styles.account}>
      <Text style={{ color: theme.muted, flexShrink: 1 }}>{auth.user?.email}</Text>
      <Pressable accessibilityRole="button" disabled={isLoggingOut} onPress={logout} style={[styles.logout, { backgroundColor: theme.soft }]}>
        <Text style={{ color: theme.ink, fontWeight: '600' }}>{isLoggingOut ? 'Loggar ut…' : 'Logga ut'}</Text>
      </Pressable>
    </View>
    {!!error && <FeedbackPanel kind="error" message={error} />}
    <View style={[styles.navigation, { borderColor: theme.line }]}>
      {([{ href: '/', label: 'Översikt', page: 'overview' }, { href: '/applications', label: 'Jobbansökningar', page: 'applications' }] as const).map(item =>
        <Link key={item.page} href={item.href} replace asChild>
          <Pressable accessibilityRole="link" accessibilityState={{ selected: current === item.page }} style={{ ...styles.link, backgroundColor: current === item.page ? theme.primary : theme.soft }}>
            <Text style={{ color: current === item.page ? '#ffffff' : theme.ink, fontWeight: '600', fontSize: 13 }}>{item.label}</Text>
          </Pressable>
        </Link>)}
    </View>
  </>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: '#172554', borderBottomWidth: 4, borderBottomColor: '#2563eb', borderRadius: 16, padding: 24, marginBottom: 20 },
  eyebrow: { color: '#bfdbfe', fontSize: 10, fontWeight: '700', letterSpacing: 1.2, lineHeight: 16 },
  brand: { fontSize: 36, lineHeight: 44, fontWeight: '700', color: '#ffffff', marginTop: 8 },
  subtitle: { color: '#dbeafe', fontSize: 15, lineHeight: 23, marginTop: 8 },
  account: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20 },
  logout: { padding: 12, minHeight: 44, borderRadius: 10 },
  navigation: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, borderBottomWidth: 1, paddingBottom: 16, marginBottom: 24 },
  link: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
});
