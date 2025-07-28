import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

export const GlobalStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  text: {
    color: Colors.light.text,
  },
  borderRadius: {
    borderRadius: 10,
    },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
  },
  // Add more global styles as needed
});
