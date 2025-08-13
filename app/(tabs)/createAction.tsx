import { GlobalStyle } from "@/constants/GlobalStyle";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CreateAction() {
  return (
    <View style={{ flex: 1, justifyContent:"flex-end",alignItems:"center" }}>
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => router.push("/event/CreateEvent")}
          style={styles.actionButton}
        >
          <Text style={styles.text}>Créer un événement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.text}>Créer un groupe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    menu: {
    flexDirection: "row",
    marginBottom: 110,
  },
  actionButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: GlobalStyle.borderRadius.borderRadius,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
})