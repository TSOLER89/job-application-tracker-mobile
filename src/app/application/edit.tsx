import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
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

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

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
        setCompany(selectedApplication.company);
        setPosition(selectedApplication.position);
        setLocation(selectedApplication.location);
        setStatus(selectedApplication.status);
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

            <TextInput
              style={styles.value}
              value={company}
              onChangeText={setCompany}
            />

            <Text style={styles.label}>Tjänst</Text>

            <TextInput
              style={styles.value}
              value={position}
              onChangeText={setPosition}
            />

            <Text style={styles.label}>Plats</Text>

            <TextInput
              style={styles.value}
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.label}>Status</Text>

            <View style={styles.statusContainer}>
              {["Ansökt", "Intervju", "Erbjudande", "Avslag"].map(
                (statusOption) => (
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
                ),
              )}
            </View>
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
});
