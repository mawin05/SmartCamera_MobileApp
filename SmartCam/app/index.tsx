import MainButton from "@/components/ui/main-button";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <MainButton
        iconName="camera"
        onPress={() => router.push("/alerts-view")}
      ></MainButton>
      <MainButton
        iconName="home"
        onPress={() => router.push("/household-view")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
