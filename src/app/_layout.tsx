import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ActivityIndicator, Text, useColorScheme, View } from 'react-native';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/components/auth-provider';
import { FeedbackProvider } from '@/components/feedback-provider';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return <AuthProvider><RootNavigation /></AuthProvider>;
}

function RootNavigation() {
  const colorScheme = useColorScheme();
  const theme = useJobTrackTheme();
  const { user, loading } = useAuth();
  useEffect(() => { void SplashScreen.hideAsync(); }, []);
  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, backgroundColor: theme.page }}>
    <ActivityIndicator color={theme.primary} />
    <Text style={{ color: theme.ink }}>Kontrollerar inloggningen…</Text>
  </View>;
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <FeedbackProvider key={user?.id ?? 'guest'}>
        <Stack screenOptions={{ headerStyle: { backgroundColor: theme.surface }, headerTintColor: theme.ink, contentStyle: { backgroundColor: theme.page }, headerBackTitle: 'Tillbaka' }}>
          <Stack.Protected guard={!user}>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={!!user}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="applications" options={{ headerShown: false }} />
            <Stack.Screen name="statistics" options={{ headerShown: false }} />
            <Stack.Screen name="email-accounts" options={{ headerShown: false }} />
            <Stack.Screen name="application/new" options={{ title: 'Ny ansökan' }} />
            <Stack.Screen name="application/[id]" options={{ title: 'Jobbansökan' }} />
            <Stack.Screen name="application/edit" options={{ title: 'Redigera' }} />
            <Stack.Screen name="explore" options={{ title: 'Utforska' }} />
          </Stack.Protected>
        </Stack>
      </FeedbackProvider>
    </ThemeProvider>
  );
}
