import { apiFetch, API_BASE_URL } from '@/services/auth-client';
import { ApplicationImageField } from "@/components/application-image-field";
import { useApplicationImage } from "@/hooks/use-application-image";
import { StatusPicker } from "@/components/status-badge";
import { useSuccessFeedback } from "@/components/feedback-provider";
import { readApiError } from "@/utils/api-error";
import { useApplicationStyles } from "@/hooks/use-application-styles";
import { FeedbackPanel } from "@/components/feedback-panel";
import { ApplicationPlanningFields } from '@/components/application-planning-fields';
import { isValidPlanningDate } from '@/utils/planning-date';

import { useRouter } from "expo-router";
import { useRef, useState } from "react";
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


export default function NewApplicationScreen() {
  const styles = useApplicationStyles();
  const showSuccess = useSuccessFeedback();
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Ansökt");
  const [dateApplied, setDateApplied] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const image = useApplicationImage();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  const handleSave = async () => {
    if (savingRef.current || image.isPicking) return;
    if (!company.trim() || !position.trim() || !location.trim()) {
      setError("Fyll i företag, tjänst och plats.");
      return;
    }

    if (status !== "Intresserad" && dateError) {
      return;
    }

    if (!isValidPlanningDate(applicationDeadline) || !isValidPlanningDate(followUpDate)) {
      setError("Ange giltiga planeringsdatum som YYYY-MM-DD, eller lämna fälten tomma.");
      return;
    }
    // Send the POST request to create a new job application
    savingRef.current = true;
    setIsSaving(true);
    setError("");
    try {
      const uploadImageUrl = await image.uploadImage();
      const response = await apiFetch(`${API_BASE_URL}/api/JobApplications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: company.trim(),
          position: position.trim(),
          location: location.trim(),
          status,
          dateApplied: status === "Intresserad" ? null : dateApplied || null,
          applicationDeadline: applicationDeadline || null,
          followUpDate: followUpDate || null,

          notes: notes.trim(),
          imageUrl: uploadImageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response, "Kunde inte spara ansökan."));
      }
      showSuccess("Jobbansökan har lagts till.");

      router.replace("/applications");
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
            <Text style={styles.title} accessibilityRole="header">Ny jobbansökan</Text>
            {!!error && <FeedbackPanel kind="error" message={error} />}

            <Text style={styles.text}>
              Fyll i formuläret för att skapa en ny jobbansökan.
            </Text>

            <Text style={styles.label}>Företag</Text>

            <TextInput
              placeholderTextColor={styles.label.color}
              editable={!isSaving}
              style={styles.input}
              placeholder="Skriv företagets namn"
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
              placeholder="Skriv tjänstens namn"
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
              placeholder="Skriv plats"
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
                  style={[styles.input, dateError ? styles.inputError : null]}
                  placeholder="YYYY-MM-DD"
                  accessibilityLabel="Ansökningsdatum, YYYY-MM-DD"
                  value={dateApplied}
                  maxLength={10}
                  onChangeText={(value) => {
                    setDateApplied(value);

                    if (!value) {
                      setDateError("");
                      return;
                    }

                    const allowedPattern = /^\d{4}-\d{2}-\d{2}$/.test(value);
                    if (!allowedPattern) {
                      setDateError("Ange datum som YYYY-MM-DD");
                      return;
                    }

                    if (value.length === 10) {
                      const [year, month, day] = value.split("-").map(Number);

                      const date = new Date(year, month - 1, day);

                      const validDate =
                        date.getFullYear() === year &&
                        date.getMonth() === month - 1 &&
                        date.getDate() === day;

                      if (!validDate) {
                        setDateError("Ange ett giltigt datum");
                        return;
                      }
                    }

                    setDateError("");
                  }}
                />

                {!!dateError && <Text style={styles.errorText} accessibilityRole="alert">{dateError}</Text>}
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
            <ApplicationImageField image={image} disabled={isSaving} />

            <Pressable
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSave}
              disabled={isSaving || image.isPicking}
              accessibilityRole="button"
              accessibilityState={{ disabled: isSaving || image.isPicking, busy: isSaving }}
            >
              <Text style={styles.saveButtonText}>{isSaving ? "Sparar..." : "Spara"}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
