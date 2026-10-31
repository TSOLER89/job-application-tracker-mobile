import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';

const FeedbackContext = createContext<(message: string) => void>(() => {});

export function useSuccessFeedback() { return useContext(FeedbackContext); }

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const theme = useJobTrackTheme();
  useEffect(() => {
    if (message) AccessibilityInfo.announceForAccessibility(message);
  }, [message]);
  return (
    <FeedbackContext.Provider value={setMessage}>
      <View style={styles.root}>
        {children}
        {!!message && <SafeAreaView edges={['bottom']} style={{ backgroundColor: theme.successBackground }}>
          <View style={styles.banner} accessibilityLiveRegion="polite">
            <Text style={[styles.message, { color: theme.success }]}>{message}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Stäng bekräftelse" onPress={() => setMessage('')} style={styles.close}>
              <Text style={{ fontSize: 26, color: theme.success }}>×</Text>
            </Pressable>
          </View>
        </SafeAreaView>}
      </View>
    </FeedbackContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 20, paddingRight: 8, paddingVertical: 8 },
  message: { flex: 1, fontSize: 15, lineHeight: 22, fontWeight: '600' },
  close: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
