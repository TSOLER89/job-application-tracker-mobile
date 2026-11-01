import { View } from 'react-native';

export type GlyphName = 'overview' | 'applications' | 'statistics' | 'offers';

export function AppGlyph({ name, color, size = 20 }: { name: GlyphName; color: string; size?: number }) {
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: size, height: size }}>
    <View style={{ width: 20, height: 20, transform: [{ scale: size / 20 }], transformOrigin: 'top left' }}>
      {name === 'overview' && [0, 1, 2, 3].map(index => <View key={index} style={{ position: 'absolute', left: index % 2 * 11, top: Math.floor(index / 2) * 11, width: 8, height: 8, borderWidth: 1.6, borderColor: color, borderRadius: 2 }} />)}
      {name === 'applications' && <>
        <View style={{ position: 'absolute', left: 5, top: 1, width: 10, height: 7, borderWidth: 1.6, borderColor: color, borderRadius: 2 }} />
        <View style={{ position: 'absolute', left: 1, top: 6, width: 18, height: 13, borderWidth: 1.6, borderColor: color, borderRadius: 3 }} />
        <View style={{ position: 'absolute', left: 2, top: 11, width: 16, height: 1.6, backgroundColor: color }} />
      </>}
      {name === 'statistics' && [8, 17, 12].map((height, index) => <View key={index} style={{ position: 'absolute', bottom: 1, left: 2 + index * 6, width: 3, height, borderRadius: 1.5, backgroundColor: color }} />)}
      {name === 'offers' && <>
        <View style={{ position: 'absolute', left: 3, top: 1, width: 14, height: 14, borderWidth: 1.6, borderColor: color, borderRadius: 8 }} />
        <View style={{ position: 'absolute', left: 8, top: 6, width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
        <View style={{ position: 'absolute', left: 5, top: 14, width: 3, height: 5, backgroundColor: color, transform: [{ rotate: '12deg' }] }} />
        <View style={{ position: 'absolute', left: 12, top: 14, width: 3, height: 5, backgroundColor: color, transform: [{ rotate: '-12deg' }] }} />
      </>}
    </View>
  </View>;
}
