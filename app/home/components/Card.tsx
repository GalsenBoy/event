import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons"; // ou Ionicons, FontAwesome etc.

import { GlobalStyle } from "@/constants/GlobalStyle";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CardHome() {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={{ position: "relative" }}>
        <Image
          source={require("@/assets/images/biblio.jpg")}
          style={styles.image}
        />
        <IconSymbol
          name="heart.fill"
          size={24}
          color={Colors.light.background}
          style={{ position: "absolute", top: 10, left: 15 }}
        />
        <Feather
          name="share-2"
          size={24}
          color={Colors.light.background}
          style={{ position: "absolute", top: 10, right: 15 }}
        />
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <View style={[styles.flexRow, { marginTop: 7, marginBottom: 5 }]}>
          <View>
            <ThemedText type="defaultSemiBold">
              Inauguration de la médiathèque
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.date}>
              Vendredi 13 Septembre 19h35
            </ThemedText>
          </View>
          <ThemedText type="defaultSemiBold">9,99€</ThemedText>
        </View>
        <View style={styles.flexRow}>
          <ThemedText>
            <Text style={{ color: Colors.light.icon }}>Par </Text>
            <ThemedText type="defaultSemiBold" style={styles.pseudoUser}>
              @utilisateur
            </ThemedText>{" "}
            <ThemedText type="defaultSemiBold">0.8km</ThemedText>
          </ThemedText>
          <IconSymbol
            name="location"
            size={16}
            color="gray"
            style={{ marginLeft: 4 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: GlobalStyle.borderRadius.borderRadius,
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    color: Colors.light.tint,
  },
  pseudoUser: {
    color: Colors.customColor.blue,
  },
});
