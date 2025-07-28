import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardHome from "../home/components/Card";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CardHome />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
