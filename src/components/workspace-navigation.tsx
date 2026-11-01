import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppGlyph } from '@/components/app-glyph';
import { useJobTrackTheme } from '@/hooks/use-jobtrack-theme';

export function WorkspaceNavigation({ current }: { current: 'overview' | 'applications' | 'statistics' | null }) {
  const theme = useJobTrackTheme();
  return <SafeAreaView edges={['bottom']} style={{ backgroundColor: theme.surface, borderTopWidth: 1, borderColor: theme.line }}>
    <View style={styles.navigation}>
      {([{ href: '/', label: 'Översikt', page: 'overview' }, { href: '/applications', label: 'Jobbansökningar', page: 'applications' }, { href: '/statistics', label: 'Statistik', page: 'statistics' }] as const).map(item =>
        <Link key={item.page} href={item.href} replace asChild>
          <Pressable accessibilityRole="link" accessibilityState={{ selected: current === item.page }} style={{ ...styles.link, backgroundColor: current === item.page ? theme.soft : 'transparent' }}>
            <AppGlyph name={item.page} color={current === item.page ? theme.accent : theme.muted} />
            <Text style={{ color: current === item.page ? theme.ink : theme.muted, fontWeight: current === item.page ? '700' : '500', fontSize: 11, textAlign: 'center' }}>{item.label}</Text>
          </Pressable>
        </Link>)}
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  navigation: { flexDirection: 'row', gap: 6, paddingHorizontal: 14, paddingVertical: 8, width: '100%', maxWidth: 740, alignSelf: 'center' },
  link: { flex: 1, minHeight: 52, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 6, borderRadius: 14, gap: 4 },
});
