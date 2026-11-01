import { authenticatedImageSource } from '@/services/auth-client';
import { Image, Pressable, Text, View } from 'react-native';
import { useApplicationStyles } from '@/hooks/use-application-styles';
import type { useApplicationImage } from '@/hooks/use-application-image';
import { FeedbackPanel } from './feedback-panel';

export function ApplicationImageField({ image, disabled, editing = false }: {
  image: ReturnType<typeof useApplicationImage>; disabled: boolean; editing?: boolean;
}) {
  const styles = useApplicationStyles();
  const busy = disabled || image.isPicking;
  return (
    <View>
      <Text style={styles.label}>Bild</Text>
      <Text style={styles.text}>JPEG, PNG eller WebP, högst 5 MiB.</Text>
      {!!image.error && <FeedbackPanel kind="error" message={image.error} />}
      {image.previewUri && <Image source={authenticatedImageSource(image.previewUri)} style={styles.imagePreview} accessibilityLabel="Förhandsvisning av ansökans bild" />}
      <Pressable accessibilityRole="button" style={[styles.imageButton, busy && styles.disabledButton]}
        disabled={busy} onPress={image.pickImage} accessibilityState={{ disabled: busy, busy: image.isPicking }}>
        <Text style={styles.imageButtonText}>{image.isPicking ? 'Öppnar bildbibliotek…' : image.previewUri ? 'Byt bild' : 'Välj bild'}</Text>
      </Pressable>
      {image.previewUri && <Pressable accessibilityRole="button" onPress={image.removeImage} disabled={busy}
        accessibilityState={{ disabled: busy }} style={[styles.dangerButton, busy && styles.disabledButton]}>
        <Text style={styles.dangerButtonText}>Ta bort bild</Text>
      </Pressable>}
      {editing && <Text style={styles.text}>Bildändringen sparas när du trycker på Spara ändringar.</Text>}
    </View>
  );
}
