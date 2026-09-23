import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const API_BASE_URL = "http://192.168.0.4:5250";

export default function ApplicationDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [application, setApplication] = useState<JobApplication | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const imageUrl = application?.imageUrl
    ? `${API_BASE_URL}${application.imageUrl}`
    : null;

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const response = await fetch(
          "http://192.168.0.4:5250/api/JobApplications",
        );

        if (!response.ok) {
          throw new Error("Kunde inte hämta jobbanssökningar");
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
        setError("");
      } catch {
        setError("Kunde inte ansluta till backend");
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {loading && <Text style={styles.message}>Laddar jobbansökan...</Text>}

        {error && <Text style={styles.error}>{error}</Text>}

        {application && (
          <View style={styles.card}>
            <Text style={styles.company}>{application.company}</Text>

            <Text style={styles.position}>{application.position}</Text>

            {imageUrl && (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            )}

            <View style={styles.detail}>
              <Text style={styles.label}>Plats</Text>

              <Text style={styles.value}>{application.location}</Text>
            </View>

            <View style={styles.detail}>
              <Text style={styles.label}>Status</Text>

              <Text style={styles.value}>{application.status}</Text>
            </View>

            {application.dateApplied && (
              <View style={styles.detail}>
                <Text style={styles.label}>Ansökningsdatum</Text>
                <Text style={styles.value}>{application.dateApplied}</Text>
              </View>
            )}

            {application.notes && (
              <View style={styles.detail}>
                <Text style={styles.label}>Anteckningar</Text>

                <Text style={styles.value}>{application.notes}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },

  content: {
    padding: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  company: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1d2a44",
  },

  position: {
    fontSize: 17,
    color: "#64748b",
    marginTop: 6,
    marginBottom: 24,
  },

  detail: {
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
  },

  value: {
    fontSize: 16,
    color: "#334155",
    marginTop: 5,
  },

  message: {
    fontSize: 16,
    color: "#475569",
  },

  error: {
    fontSize: 16,
    color: "#b91c1c",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginBottom: 24,
    resizeMode: "cover",
  },
});
