import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

export default function FloatingActionMenu() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);

    Animated.timing(animation, {
      toValue: menuVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const menuStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation,
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Boutons visibles uniquement si menuVisible */}
      {menuVisible && (
        <Animated.View style={[styles.menu, menuStyle]}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.text}>Créer un événement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.text}>Créer un groupe</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Bouton central + */}
      <TouchableOpacity style={styles.plusButton} onPress={toggleMenu}>
        <IconSymbol name="plus" color={Colors.light.background} />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 120,
    alignSelf: "center",
    alignItems: "center",
    zIndex: 10,
  },
  menu: {
    flexDirection: "row",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  actionButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
  plusButton: {
    backgroundColor: "red",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
