import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { useEffect } from "react";

import { FeedbackProvider } from "@/components/feedback-provider";
import { useJobTrackTheme } from "@/hooks/use-jobtrack-theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useJobTrackTheme();
  useEffect(() => { void SplashScreen.hideAsync(); }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <FeedbackProvider>
        <Stack screenOptions={{ headerStyle: { backgroundColor: theme.surface }, headerTintColor: theme.ink, contentStyle: { backgroundColor: theme.page }, headerBackTitle: 'Tillbaka' }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="application/new"
            options={{ title: "Ny ansökan" }}
          />

          <Stack.Screen
            name="application/[id]"
            options={{
              title: "Jobbansökan",
            }}
          />

          <Stack.Screen
            name="application/edit"
            options={{
              title: "Redigera",
            }}
          />
        </Stack>
      </FeedbackProvider>
    </ThemeProvider>
  );
}
