import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Screen for displaying the details of a job application
export default function ApplicationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Jobbansökan</Text>

        <Text style={styles.text}>
          Här kommer detaljerna för jobbansökan att visas.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Styles for the application screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fb",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1d2a44",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: "#475569",
  },
});
