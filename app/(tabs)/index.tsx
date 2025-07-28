import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardHome from "../home/components/Card";
import Search from "../home/components/Search";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Search />
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
