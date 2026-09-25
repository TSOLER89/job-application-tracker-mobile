import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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

export default function EditApplicationScreen() {
  const { id } = useLocalSearchParams();

  const [application, setApplication] = useState<JobApplication | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const response = await fetch(
          "http://192.168.0.4:5250/api/JobApplications",
        );

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
      <View style={styles.card}>
        <Text style={styles.title}>Redigera jobbansökan</Text>

        {loading && <Text style={styles.text}>Laddar ansökan...</Text>}

        {error && <Text style={styles.error}>{error}</Text>}

        {application && (
          <>
            <Text style={styles.label}>Företag</Text>

            <Text style={styles.value}>{application.company}</Text>

            <Text style={styles.label}>Tjänst</Text>

            <Text style={styles.value}>{application.position}</Text>
          </>
        )}
      </View>
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
});
