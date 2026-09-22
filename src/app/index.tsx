import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnimatedIcon } from "@/components/animated-icon";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}
type JobApplication = {
  id: number;
  company: string;
  position: string;
  location: string;
  status: string;
};

export default function HomeScreen() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        console.log("STARTAR FETCH");

        const response = await fetch(
          "http://192.168.0.4:5250/api/JobApplications",
        );

        console.log("STATUS:", response.status);

        const data = await response.json();

        console.log("DATA:", data);

        setApplications(data);
        setError("");
      } catch (error) {
        console.log("FETCH ERROR:", error);
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
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            JobTrack
          </ThemedText>
          <ThemedText type="subtitle">
            Håll koll på dina jobbansökningar
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          Mina jobbansökningar
        </ThemedText>

        {loading && <ThemedText>Laddar ansökningar...</ThemedText>}

        {error && <ThemedText>{error}</ThemedText>}

        {applications.map((application) => (
          <ThemedView key={application.id} style={styles.applicationCard}>
            <ThemedText style={styles.company}>
              {application.company}
            </ThemedText>

            <ThemedText style={styles.position}>
              {application.position}
            </ThemedText>

            <ThemedText style={styles.location}>
              {application.location}
            </ThemedText>

            <ThemedText style={styles.location}>
              Status: {application.status}
            </ThemedText>
          </ThemedView>
        ))}

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  applicationCard: {
    alignSelf: "stretch",
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
});
