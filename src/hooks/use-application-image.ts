import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';
import { readApiError } from '@/utils/api-error';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export function useApplicationImage() {
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState('');
  const pickingRef = useRef(false);
  const uploadedRef = useRef<{ uri: string; url: string } | null>(null);

  const resetImage = useCallback((url: string | null) => {
    setSavedUrl(url);
    setSelected(null);
    uploadedRef.current = null;
    setError('');
  }, []);

  async function pickImage() {
    if (pickingRef.current) return;
    pickingRef.current = true;
    setIsPicking(true);
    setError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], allowsEditing: true, quality: 1,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        setError('Bilden får vara högst 5 MiB. Välj en mindre bild.');
        return;
      }
      setSelected(asset);
      uploadedRef.current = null;
    } catch {
      setError('Kunde inte öppna bildbiblioteket. Försök igen.');
    } finally {
      pickingRef.current = false;
      setIsPicking(false);
    }
  }

  function removeImage() {
    resetImage(null);
  }

  async function uploadImage(): Promise<string | null> {
    if (!selected) return savedUrl;
    if (uploadedRef.current?.uri === selected.uri) return uploadedRef.current.url;

    const form = new FormData();
    if (Platform.OS === 'web') {
      const file = selected.file ?? await (await fetch(selected.uri)).blob();
      form.append('file', file, selected.fileName ?? 'image.jpg');
    } else {
      form.append('file', new File(selected.uri));
    }
    const response = await expoFetch(`${API_BASE_URL}/api/JobApplications/uploadimage`, {
      method: 'POST', body: form,
    });
    if (!response.ok) throw new Error(await readApiError(response, 'Kunde inte ladda upp bilden.'));
    const data: { imageUrl: string } = await response.json();
    uploadedRef.current = { uri: selected.uri, url: data.imageUrl };
    return data.imageUrl;
  }

  const previewUri = selected?.uri ?? (savedUrl
    ? /^https?:\/\//i.test(savedUrl) ? savedUrl : `${API_BASE_URL}${savedUrl}`
    : null);

  return { previewUri, isPicking, error, pickImage, removeImage, resetImage, uploadImage };
}
