import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditApplicationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Redigera jobbansökan</Text>

        <Text style={styles.text}>
          Här kan du redigera informationen för jobbansökan.
        </Text>
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
});
