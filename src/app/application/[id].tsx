import { apiFetch, API_BASE_URL, authenticatedImageSource } from '@/services/auth-client';
import { useFocusedResource } from "@/hooks/use-focused-resource";
import { useApplicationStyles } from "@/hooks/use-application-styles";
import { FeedbackPanel } from "@/components/feedback-panel";
import { StatusBadge } from "@/components/status-badge";
import { useToday } from '@/hooks/use-today';
import { PlanningNotices } from '@/components/planning-notices';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useSuccessFeedback } from "@/components/feedback-provider";
import { readApiError } from "@/utils/api-error";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
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


export default function ApplicationDetailsScreen() {
  const styles = useApplicationStyles();
  const today = useToday();
  const router = useRouter();
  const showSuccess = useSuccessFeedback();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const deletingRef = useRef(false);

  const { id } = useLocalSearchParams();

  const { data: application, loading, error, reload } = useFocusedResource<JobApplication>(`${API_BASE_URL}/api/JobApplications/${id}`);
  const imageUrl = application?.imageUrl
    ? /^https?:\/\//i.test(application.imageUrl) ? application.imageUrl : `${API_BASE_URL}${application.imageUrl}`
    : null;

  async function deleteApplication() {
    if (!application || deletingRef.current) return;
    deletingRef.current = true;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/JobApplications/${application.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await readApiError(response, 'Kunde inte radera ansökan. Försök igen.'));
      showSuccess('Jobbansökan har raderats.');
      router.dismissTo('/applications');
    } catch (error) {
      setDeleteError(error instanceof Error && error.name !== 'TypeError' ? error.message : 'Kunde inte nå servern. Ansökan finns kvar, försök igen.');
    } finally {
      deletingRef.current = false;
      setIsDeleting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading && <FeedbackPanel kind="loading" message="Laddar ansökan…" />}

        {!!error && <FeedbackPanel kind="error" message={error} onRetry={() => { void reload(); }} />}

        {application && !loading && !error && (
          <View style={styles.card}>
            <Text style={styles.company}>{application.company}</Text>

            <Text style={styles.position}>{application.position}</Text>
            <PlanningNotices application={application} today={today} />

            {imageUrl && (
              <Image source={authenticatedImageSource(imageUrl)} style={styles.image} />
            )}

            {application.applicationDeadline && <View style={styles.detail}><Text style={styles.label}>Sista ansökningsdag</Text><Text style={styles.value}>{application.applicationDeadline}</Text></View>}
            {application.followUpDate && <View style={styles.detail}><Text style={styles.label}>Uppföljningsdatum</Text><Text style={styles.value}>{application.followUpDate}</Text></View>}
            <View style={styles.detail}>
              <Text style={styles.label}>Plats</Text>

              <Text style={styles.value}>{application.location}</Text>
            </View>

            <View style={styles.detail}>
              <Text style={styles.label}>Status</Text>

              <StatusBadge status={application.status} />
            </View>

            {application.dateApplied && (
              <View style={styles.detail}>
                <Text style={styles.label}>Ansökningsdatum</Text>
                <Text style={styles.value}>{application.dateApplied}</Text>
              </View>
            )}

            {!!application.notes && (
              <View style={styles.detail}>
                <Text style={styles.label}>Anteckningar</Text>

                <Text style={styles.value}>{application.notes}</Text>
              </View>
            )}
            <Pressable
              accessibilityRole="button"
              style={styles.editButton}
              disabled={isDeleting || confirmDelete}
              onPress={() =>
                router.push({
                  pathname: "/application/edit",
                  params: {
                    id: application.id.toString(),
                  },
                })
              }
            >
              <Text style={styles.editButtonText}>Redigera</Text>
            </Pressable>
            {confirmDelete ? (
              <View style={styles.confirmation} accessibilityRole="alert">
                <Text style={styles.title}>Radera ansökan?</Text>
                <Text style={styles.text}>Ansökan hos {application.company} tas bort permanent.</Text>
                {!!deleteError && <FeedbackPanel kind="error" message={deleteError} />}
                <Pressable accessibilityRole="button" onPress={deleteApplication} disabled={isDeleting}
                  accessibilityState={{ disabled: isDeleting, busy: isDeleting }}
                  style={[styles.dangerButton, isDeleting && styles.disabledButton]}>
                  <Text style={styles.dangerButtonText}>{isDeleting ? 'Raderar…' : 'Ja, radera ansökan'}</Text>
                </Pressable>
                <Pressable accessibilityRole="button" disabled={isDeleting} onPress={() => { setConfirmDelete(false); setDeleteError(''); }} style={styles.secondaryButton}>
                  <Text style={styles.imageButtonText}>Avbryt</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable accessibilityRole="button" onPress={() => setConfirmDelete(true)} style={styles.dangerButton}>
                <Text style={styles.dangerButtonText}>Radera ansökan</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
