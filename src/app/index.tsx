import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.heroCard}>
            <ThemedText style={styles.eyebrow}>
              JOB APPLICATION TRACKER
            </ThemedText>

            <ThemedText style={styles.heroTitle}>JobTrack</ThemedText>

            <ThemedText style={styles.heroSubtitle}>
              Dina ansökningar. Samlade på ett ställe.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              Mina jobbansökningar
            </ThemedText>

            <ThemedText style={styles.applicationCount}>
              {applications.length}
            </ThemedText>
          </ThemedView>

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
                <ThemedView style={styles.cardHeader}>
                  <ThemedText style={styles.company}>
                    {application.company}
                  </ThemedText>

                  <ThemedText style={styles.statusBadge}>
                    {application.status}
                  </ThemedText>
                </ThemedView>

                <ThemedText style={styles.position}>
                  {application.position}
                </ThemedText>

                <ThemedText style={styles.location}>
                  {application.location}
                </ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </ScrollView>
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

  scrollContent: {
    paddingBottom: 40,
  },

  heroCard: {
    backgroundColor: "#1d2a44",
    padding: 24,
    borderRadius: 22,
    marginBottom: 28,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#b8c4d9",
    marginBottom: 10,
  },

  heroTitle: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "700",
    color: "#ffffff",
  },

  heroSubtitle: {
    fontSize: 15,
    color: "#d8e0ec",
    marginTop: 8,
    lineHeight: 15,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "700",
    color: "#1d2a44",
  },

  applicationCount: {
    backgroundColor: "#e8eef7",
    color: "#1d2a44",
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  pressable: {
    marginBottom: 14,
  },

  applicationCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18, //gör kortet rundare

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8, // Add shadow radius for iOS

    elevation: 3, // Add shadow for Android
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

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  statusBadge: {
    backgroundColor: "#e8eef7",
    color: "#1d2a44",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  errorText: {
    color: "#b91c1c",
    marginBottom: 16,
  },
});
