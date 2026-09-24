import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewApplicationScreen() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Ansökt");
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Ny jobbansökan</Text>

          <Text style={styles.text}>
            Fyll i formuläret för att skapa en ny jobbansökan.
          </Text>

          <Text style={styles.label}>Företag</Text>

          <TextInput
            style={styles.input}
            placeholder="Skriv företagets namn"
            value={company}
            onChangeText={setCompany}
          />
          <Text style={styles.label}>Tjänst</Text>

          <TextInput
            style={styles.input}
            placeholder="Skriv tjänstens namn"
            value={position}
            onChangeText={setPosition}
          />
          <Text style={styles.label}>Plats</Text>

          <TextInput
            style={styles.input}
            placeholder="Skriv plats"
            value={location}
            onChangeText={setLocation}
          />
          <Text style={styles.label}>Status</Text>

          <View style={styles.statusContainer}>
            {["Ansökt", "Intresserad", "Intervju", "Erbjudande", "Avslag"].map(
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 18,
  },

  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    color: "#666",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginTop: 24,
    marginBottom: 8,
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
  },

  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  },

  notesInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});
