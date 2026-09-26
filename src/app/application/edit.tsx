import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type JobApplication = {
  id: number;
  company: string;
  position: string;
  location: string;
  status: string;
  dateApplied: string | null;
  notes: string | null;
  imageUrl: string | null;
};

export default function EditApplicationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [application, setApplication] = useState<JobApplication | null>(null);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Ansökt");
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/JobApplications`);

        if (!response.ok) {
          throw new Error();
        }

        const data: JobApplication[] = await response.json();

        const selectedApplication = data.find(
          (application) => application.id === Number(id),
        );

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
        setNotes(selectedApplication.notes ?? "");

        setError("");
      } catch {
        setError("Kunde inte ansluta till backend");
      } finally {
        setLoading(false);
      }
    };
    loadApplication();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(
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
            dateApplied: status === "Intresserad" ? null : dateApplied,
            notes: notes.trim(),
            imageUrl: application?.imageUrl ?? null, // Preserve the existing image URL if available
          }),
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      router.replace({
        pathname: "/application/[id]", // Navigate to the application detail page after saving
        params: { id: Number(id) }, // Pass the ID as a parameter
      });
    } catch {
      setError("Kunde inte spara ändringar");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.title}>Redigera jobbansökan</Text>

            {loading && <Text style={styles.text}>Laddar ansökan...</Text>}

            {error && <Text style={styles.error}>{error}</Text>}

            {application && (
              <>
                <Text style={styles.label}>Företag</Text>

                <TextInput
                  style={styles.input}
                  value={company}
                  onChangeText={setCompany}
                />

                <Text style={styles.label}>Tjänst</Text>

                <TextInput
                  style={styles.input}
                  value={position}
                  onChangeText={setPosition}
                />

                <Text style={styles.label}>Plats</Text>

                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                />

                <Text style={styles.label}>Status</Text>

                <View style={styles.statusContainer}>
                  {[
                    "Ansökt",
                    "Intresserad",
                    "Intervju",
                    "Erbjudande",
                    "Avslag",
                  ].map((statusOption) => (
                    <Text
                      key={statusOption}
                      style={[
                        styles.statusOption,
                        status === statusOption && styles.statusOptionActive,
                      ]}
                      onPress={() => setStatus(statusOption)}
                    >
                      {statusOption}
                    </Text>
                  ))}
                </View>

                {status !== "Intresserad" && (
                  <>
                    <Text style={styles.label}>Ansökningsdatum</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="YYYY-MM-DD"
                      value={dateApplied}
                      onChangeText={setDateApplied}
                    />
                  </>
                )}

                <Text style={styles.label}>Anteckningar</Text>

                <TextInput
                  style={[styles.input, styles.notesInput]}
                  placeholder="Skriv anteckningar..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                />

                <Pressable style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Spara ändringar</Text>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },

  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700",
    color: "#1d2a44",
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    marginTop: 16,
    textTransform: "uppercase",
  },

  value: {
    fontSize: 16,
    color: "#334155",
    marginTop: 5,
  },

  error: {
    color: "#b91c1c",
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#dbe3ee",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#1d2a44",
    marginTop: 6,
  },

  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },

  statusOption: {
    backgroundColor: "#e8eef7",
    color: "#1d2a44",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: "600",
  },

  statusOptionActive: {
    backgroundColor: "#1d2a44",
    color: "#ffffff",
    borderColor: "#1d2a44",
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#1d2a44",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
