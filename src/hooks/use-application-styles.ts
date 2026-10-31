import { StyleSheet } from 'react-native';
import { useJobTrackTheme } from './use-jobtrack-theme';

export function useApplicationStyles() {
  const theme = useJobTrackTheme();
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.page },
    keyboardView: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40, width: '100%', maxWidth: 740, alignSelf: 'center' },
    content: { padding: 20, paddingBottom: 40, width: '100%', maxWidth: 740, alignSelf: 'center' },
    card: { backgroundColor: theme.surface, borderRadius: 16, borderWidth: 1, borderColor: theme.line, padding: 22 },
    title: { color: theme.ink, fontSize: 25, lineHeight: 33, fontWeight: '700', marginBottom: 10 },
    company: { color: theme.ink, fontSize: 26, lineHeight: 34, fontWeight: '700' },
    position: { color: theme.muted, fontSize: 17, lineHeight: 25, marginTop: 6, marginBottom: 20 },
    text: { color: theme.muted, fontSize: 15, lineHeight: 23 },
    label: { color: theme.muted, fontSize: 14, fontWeight: '600', marginTop: 20, marginBottom: 8 },
    value: { color: theme.ink, fontSize: 16, lineHeight: 25, marginTop: 5 },
    detail: { marginTop: 16, borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 4 },
    input: { backgroundColor: theme.surface, color: theme.ink, borderWidth: 1, borderColor: theme.line, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, minHeight: 48, fontSize: 16 },
    inputError: { borderColor: theme.error },
    notesInput: { minHeight: 110, textAlignVertical: 'top' },
    error: { color: theme.error, backgroundColor: theme.errorBackground, padding: 14, borderRadius: 10, fontSize: 15, lineHeight: 23, marginBottom: 16 },
    errorText: { color: theme.error, fontSize: 14, lineHeight: 22, marginTop: 6 },
    message: { color: theme.muted, fontSize: 16, lineHeight: 24 },
    saveButton: { backgroundColor: theme.primary, minHeight: 48, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', borderRadius: 10, marginTop: 24 },
    editButton: { backgroundColor: theme.primary, minHeight: 48, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', borderRadius: 10, marginTop: 24 },
    saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
    editButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
    disabledButton: { opacity: 0.65 },
    imageButton: { backgroundColor: theme.soft, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
    dangerButton: { backgroundColor: theme.errorBackground, borderColor: theme.error, borderWidth: 1, minHeight: 48, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', borderRadius: 10, marginTop: 12, marginBottom: 12 },
    dangerButtonText: { color: theme.error, fontSize: 16, fontWeight: '600' },
    secondaryButton: { backgroundColor: theme.soft, minHeight: 48, padding: 14, alignItems: 'center', borderRadius: 10, marginTop: 12 },
    confirmation: { borderWidth: 1, borderColor: theme.error, backgroundColor: theme.errorBackground, borderRadius: 12, padding: 18, marginTop: 24 },
    imageButtonText: { color: theme.ink, fontSize: 15, fontWeight: '600' },
    imagePreview: { width: '100%', height: 180, borderRadius: 10, marginTop: 16 },
    image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 8 },
  });
}
