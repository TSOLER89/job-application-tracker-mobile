import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type JobApplication = {
  id: number;
  company: string;
  position: string;
  location: string;
  status: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const [applications, setApplications] = useState<JobApplication[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await fetch(
          "http://192.168.0.4:5250/api/JobApplications",
        );

        if (!response.ok) {
          throw new Error("Kunde inte hämta jobbansökningar");
        }

        const data = await response.json();

        setApplications(data);
        setError("");
      } catch {
        setError("Kunde inte ansluta till backend");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            JobTrack
          </ThemedText>

          <ThemedText type="subtitle">
            Håll koll på dina jobbansökningar
          </ThemedText>
        </ThemedView>

        <ThemedText style={styles.sectionTitle}>
          Mina jobbansökningar
        </ThemedText>

        {loading && <ThemedText>Laddar ansökningar...</ThemedText>}

        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

        {applications.map((application) => (
          <Pressable
            key={application.id}
            style={styles.pressable}
            onPress={() =>
              router.push({
                pathname: "/application/[id]",
                params: {
                  id: application.id.toString(),
                },
              })
            }
          >
            <ThemedView style={styles.applicationCard}>
              <ThemedText style={styles.company}>
                {application.company}
              </ThemedText>

              <ThemedText style={styles.position}>
                {application.position}
              </ThemedText>

              <ThemedText style={styles.location}>
                {application.location}
              </ThemedText>

              <ThemedText style={styles.status}>
                Status: {application.status}
              </ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
  },

  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  heroSection: {
    marginBottom: 28,
  },

  title: {
    color: "#1d2a44",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  pressable: {
    marginBottom: 14,
  },

  applicationCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  company: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d2a44",
  },

  position: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 4,
  },

  location: {
    fontSize: 14,
    color: "#475569",
    marginTop: 14,
  },

  status: {
    fontSize: 14,
    color: "#475569",
    marginTop: 8,
  },

  errorText: {
    color: "#b91c1c",
    marginBottom: 16,
  },
});
