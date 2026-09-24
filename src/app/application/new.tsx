import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewApplicationScreen() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  return (
    <SafeAreaView style={styles.container}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    padding: 20,
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
});
