import { useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/components/auth-provider';
import { FeedbackPanel } from '@/components/feedback-panel';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';
import { AppGlyph } from '@/components/app-glyph';

export function WorkspaceHeader() {
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
    <View style={[styles.hero, { borderColor: theme.line }]}>
      <View style={styles.brandRow}>
        <View style={styles.brandGroup}>
          <View style={styles.brandMark}><AppGlyph name="applications" color="#ffffff" size={21} /></View>
          <Text style={[styles.brand, { color: theme.ink }]} accessibilityRole="header">JobTrack</Text>
        </View>
        <Pressable accessibilityRole="button" disabled={isLoggingOut} onPress={logout} style={[styles.logout, { borderColor: theme.line, backgroundColor: theme.surface }]}>
          <Text style={[styles.logoutText, { color: theme.muted }]}>{isLoggingOut ? 'Loggar ut…' : 'Logga ut'}</Text>
        </Pressable>
      </View>
      <View style={styles.identity}>
        <View style={[styles.avatar, { backgroundColor: theme.soft }]}><Text style={{ color: theme.accent, fontSize: 11, fontWeight: '700' }}>{auth.user?.email.charAt(0).toUpperCase()}</Text></View>
        <Text style={[styles.account, { color: theme.muted }]}>Inloggad som {auth.user?.email}</Text>
        <Link href="/email-accounts" replace asChild><Pressable accessibilityRole="link" style={{ minHeight: 44, justifyContent: 'center', paddingLeft: 8 }}><Text style={{ color: theme.accent, fontSize: 11, fontWeight: '600' }}>Mejlkonton</Text></Pressable></Link>
      </View>
    </View>
    {!!error && <FeedbackPanel kind="error" message={error} />}
  </>;
}

const styles = StyleSheet.create({
  hero: { borderBottomWidth: 1, paddingBottom: 16, marginBottom: 24 },
  brand: { fontSize: 24, lineHeight: 31, fontWeight: '700', letterSpacing: -0.8 },
  brandGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#9a4b2f', alignItems: 'center', justifyContent: 'center' },
  brandRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10 },
  avatar: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  account: { fontSize: 11, lineHeight: 17, flexShrink: 1 },
  logout: { paddingHorizontal: 12, paddingVertical: 10, minHeight: 44, justifyContent: 'center', borderRadius: 11, borderWidth: 1 },
  logoutText: { fontSize: 12, fontWeight: '600' },
});
