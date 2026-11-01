import { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/components/auth-provider';
import { FeedbackPanel } from '@/components/feedback-panel';
import { useApplicationStyles } from '@/hooks/use-application-styles';

export default function WelcomeScreen() {
  const auth = useAuth();
  const styles = useApplicationStyles();
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const register = mode === 'register';

  function choose(next: typeof mode) {
    setMode(next); setPassword(''); setConfirmation(''); setError('');
  }
  async function submit() {
    if (busyRef.current || mode === 'welcome') return;
    if (!email.trim() || !password) { setError('Fyll i mejladress och lösenord.'); return; }
    if (register && password !== confirmation) { setError('Lösenorden stämmer inte överens.'); return; }
    busyRef.current = true; setBusy(true); setError('');
    try { await auth.login(mode, email, password); setPassword(''); setConfirmation(''); Keyboard.dismiss(); }
    catch (error) { setError(error instanceof Error && !['TypeError', 'AbortError'].includes(error.name) ? error.message : 'Kunde inte nå servern. Kontrollera anslutningen och försök igen.'); }
    finally { busyRef.current = false; setBusy(false); }
  }

  return <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={{ backgroundColor: '#172554', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <Text style={{ color: '#bfdbfe', fontSize: 11, lineHeight: 18, fontWeight: '700' }}>DIN KARRIÄR, ETT STEG I TAGET</Text>
          <Text style={{ color: '#ffffff', fontSize: 36, lineHeight: 46, fontWeight: '700', marginTop: 8 }}>JobTrack</Text>
          <Text style={{ color: '#dbeafe', fontSize: 16, lineHeight: 25, marginTop: 12 }}>Dina ansökningar. Samlade på ett ställe.</Text>
        </View>
        {!!auth.error && <FeedbackPanel kind="error" message={auth.error} onRetry={() => { void auth.restore(); }} />}
        <View style={styles.card}>
          {mode === 'welcome' ? <>
            <Text style={styles.title} accessibilityRole="header">Plats för nästa steg.</Text>
            <Text style={styles.text}>Skapa ditt konto och samla dina ansökningar i en personlig översikt på webb och mobil.</Text>
            <Pressable accessibilityRole="button" style={styles.saveButton} onPress={() => choose('register')}><Text style={styles.saveButtonText}>Skapa konto</Text></Pressable>
            <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={() => choose('login')}><Text style={styles.imageButtonText}>Logga in</Text></Pressable>
          </> : <>
            <Text style={styles.title} accessibilityRole="header">{register ? 'Skapa ditt konto' : 'Välkommen tillbaka'}</Text>
            <Text style={styles.text}>{register ? 'Välj ett nytt lösenord för ditt JobTrack-konto.' : 'Logga in med ditt JobTrack-konto.'}</Text>
            {!!error && <FeedbackPanel kind="error" message={error} />}
            <Text style={styles.label}>Mejladress</Text>
            <TextInput style={styles.input} placeholderTextColor={styles.label.color} accessibilityLabel="Mejladress" keyboardType="email-address" autoComplete="email" autoCapitalize="none" autoCorrect={false} maxLength={254} editable={!busy} value={email} onChangeText={setEmail} />
            <Text style={styles.label}>Lösenord</Text>
            <TextInput style={styles.input} accessibilityLabel="Lösenord" secureTextEntry autoComplete={register ? 'new-password' : 'current-password'} autoCapitalize="none" maxLength={128} editable={!busy} value={password} onChangeText={setPassword} />
            {register && <>
              <Text style={styles.text}>Minst 10 tecken, med stor och liten bokstav samt en siffra.</Text>
              <Text style={styles.label}>Bekräfta lösenord</Text>
              <TextInput style={styles.input} accessibilityLabel="Bekräfta lösenord" secureTextEntry autoComplete="new-password" maxLength={128} editable={!busy} value={confirmation} onChangeText={setConfirmation} />
            </>}
            <Pressable accessibilityRole="button" style={[styles.saveButton, busy && styles.disabledButton]} disabled={busy} accessibilityState={{ disabled: busy, busy }} onPress={submit}><Text style={styles.saveButtonText}>{busy ? 'Vänta…' : register ? 'Skapa konto' : 'Logga in'}</Text></Pressable>
            <Pressable accessibilityRole="button" style={styles.secondaryButton} disabled={busy} onPress={() => choose(register ? 'login' : 'register')}><Text style={styles.imageButtonText}>{register ? 'Har du redan konto? Logga in' : 'Ny här? Skapa konto'}</Text></Pressable>
            <Pressable accessibilityRole="button" style={styles.secondaryButton} disabled={busy} onPress={() => choose('welcome')}><Text style={styles.imageButtonText}>Till startsidan</Text></Pressable>
          </>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
