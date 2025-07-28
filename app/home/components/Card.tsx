import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { GlobalStyle } from "@/constants/GlobalStyle";
import { Image, StyleSheet, View } from "react-native";

export default function CardHome() {
  return (
    <View style={styles.container}>
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
        <IconSymbol
          name="shared.with.you"
          size={24}
          color={Colors.light.background}
          style={{ position: "absolute", top: 10, right: 15 }}
        />
      </View>
     <View style={{paddingHorizontal: 10}}>
       <View style={[styles.flexRow,{marginTop:7,marginBottom: 5}]}> 
        <View>
          <ThemedText type="defaultSemiBold">Inauguration de la médiathèque</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.date}>Vendredi 13 Septembre 19h35</ThemedText>
        </View>
        <ThemedText type="defaultSemiBold">9.99€</ThemedText>
      </View>
      <View style={styles.flexRow}>
        <ThemedText>Par @utilisateur 0.8km</ThemedText>
        <IconSymbol
          name="location"
          size={16}
          color="gray"
          style={{ marginLeft: 4 }}
        />
      </View>
     </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius:GlobalStyle.borderRadius.borderRadius,
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
  date:{
    color:Colors.light.tint
  }
});