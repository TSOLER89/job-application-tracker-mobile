import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewApplicationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ny jobbansökan</Text>

        <Text style={styles.text}>
          Fyll i formuläret för att skapa en ny jobbansökan.
        </Text>
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
});
