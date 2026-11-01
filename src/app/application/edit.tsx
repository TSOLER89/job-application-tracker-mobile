import { apiFetch, API_BASE_URL } from '@/services/auth-client';
import { StatusPicker } from "@/components/status-badge";
import { ApplicationImageField } from "@/components/application-image-field";
import { useApplicationImage } from "@/hooks/use-application-image";
import { useSuccessFeedback } from "@/components/feedback-provider";
import { readApiError } from "@/utils/api-error";
import { useApplicationStyles } from "@/hooks/use-application-styles";
import { FeedbackPanel } from "@/components/feedback-panel";
import { ApplicationPlanningFields } from '@/components/application-planning-fields';
import { isValidPlanningDate } from '@/utils/planning-date';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type JobApplication = {
  id: number;
  company: string;
  position: string;
  location: string;
  status: string;
  dateApplied: string | null;
  applicationDeadline: string | null;
  followUpDate: string | null;
  notes: string | null;
  imageUrl: string | null;
};

export default function EditApplicationScreen() {
  const styles = useApplicationStyles();
  const showSuccess = useSuccessFeedback();
  const image = useApplicationImage();
  const { resetImage } = image;
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [application, setApplication] = useState<JobApplication | null>(null);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Ansökt");
  const [dateApplied, setDateApplied] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    const loadApplication = async () => {
      setLoading(true);
      setError("");
      setApplication(null);
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/JobApplications/${id}`);

        if (!response.ok) {
          throw new Error();
        }

        const selectedApplication: JobApplication = await response.json();
        if (!active) return;

        if (!selectedApplication) {
          setError("Jobbansökan hittades inte");
          return;
        }
        setApplication(selectedApplication);
        setCompany(selectedApplication.company);
        setPosition(selectedApplication.position);
        setLocation(selectedApplication.location);
        setStatus(selectedApplication.status);
        setDateApplied(selectedApplication.dateApplied ?? "");
        setApplicationDeadline(selectedApplication.applicationDeadline ?? "");
        setFollowUpDate(selectedApplication.followUpDate ?? "");
        setNotes(selectedApplication.notes ?? "");
        resetImage(selectedApplication.imageUrl);

        setError("");
      } catch {
        if (active) setError("Kunde inte hämta ansökan. Kontrollera anslutningen och försök igen.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadApplication();
    return () => { active = false; };
  }, [id, reloadToken, resetImage]);

  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  const handleSave = async () => {
    if (savingRef.current || image.isPicking) return;
    if (!company.trim() || !position.trim() || !location.trim()) {
      setError("Företag, tjänst och plats måste fyllas i.");
      return;
    }
    if (status !== "Intresserad" && dateApplied && !/^\d{4}-\d{2}-\d{2}$/.test(dateApplied)) {
      setError("Ange datum som YYYY-MM-DD.");
      return;
    }

    if (!isValidPlanningDate(applicationDeadline) || !isValidPlanningDate(followUpDate)) {
      setError("Ange giltiga planeringsdatum som YYYY-MM-DD, eller lämna fälten tomma.");
      return;
    }
    savingRef.current = true;
    setIsSaving(true);
    setError("");
    try {
      const imageUrl = await image.uploadImage();
      const response = await apiFetch(
        `${API_BASE_URL}/api/JobApplications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: Number(id),
            company: company.trim(),
            position: position.trim(),
            location: location.trim(),
            status,
            dateApplied: status === "Intresserad" ? null : dateApplied || null,
            applicationDeadline: applicationDeadline || null,
            followUpDate: followUpDate || null,
            notes: notes.trim(),
            imageUrl,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(await readApiError(response, "Kunde inte spara ändringarna."));
      }

      showSuccess("Ändringarna har sparats.");
      router.back();
    } catch (error) {
      setError(error instanceof Error && error.name !== 'TypeError' ? error.message : "Kunde inte nå servern. Dina uppgifter finns kvar, försök igen.");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title} accessibilityRole="header">Redigera jobbansökan</Text>

            {loading && <FeedbackPanel kind="loading" message="Laddar ansökan…" />}

            {!!error && <FeedbackPanel kind="error" message={error} onRetry={!application && !loading ? () => setReloadToken(value => value + 1) : undefined} />}

            {application && (
              <>
                <Text style={styles.label}>Företag</Text>

                <TextInput
                  placeholderTextColor={styles.label.color}
                  editable={!isSaving}
                  style={styles.input}
                  accessibilityLabel="Företag"
                  maxLength={200}
                  value={company}
                  onChangeText={setCompany}
                />

                <Text style={styles.label}>Tjänst</Text>

                <TextInput
                  placeholderTextColor={styles.label.color}
                  editable={!isSaving}
                  style={styles.input}
                  accessibilityLabel="Tjänst"
                  maxLength={200}
                  value={position}
                  onChangeText={setPosition}
                />

                <Text style={styles.label}>Plats</Text>

                <TextInput
                  placeholderTextColor={styles.label.color}
                  editable={!isSaving}
                  style={styles.input}
                  accessibilityLabel="Plats"
                  maxLength={200}
                  value={location}
                  onChangeText={setLocation}
                />

                <Text style={styles.label}>Status</Text>

                <StatusPicker value={status} onChange={setStatus} disabled={isSaving} />

                {status !== "Intresserad" && (
                  <>
                    <Text style={styles.label}>Ansökningsdatum (valfritt)</Text>

                    <TextInput
                      placeholderTextColor={styles.label.color}
                      editable={!isSaving}
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      accessibilityLabel="Ansökningsdatum, YYYY-MM-DD"
                      value={dateApplied}
                      onChangeText={setDateApplied}
                    />
                  </>
                )}

                <ApplicationPlanningFields deadline={applicationDeadline} followUp={followUpDate} onDeadlineChange={setApplicationDeadline} onFollowUpChange={setFollowUpDate} disabled={isSaving} />
                <Text style={styles.label}>Anteckningar</Text>

                <TextInput
                  placeholderTextColor={styles.label.color}
                  editable={!isSaving}
                  style={[styles.input, styles.notesInput]}
                  placeholder="Skriv anteckningar..."
                  accessibilityLabel="Anteckningar"
                  maxLength={5000}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />

                <ApplicationImageField image={image} disabled={isSaving} editing />

                <Pressable
                  style={[styles.saveButton, isSaving && styles.disabledButton]}
                  onPress={handleSave}
                  disabled={isSaving || image.isPicking}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isSaving || image.isPicking, busy: isSaving }}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving ? "Sparar..." : "Spara ändringar"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
