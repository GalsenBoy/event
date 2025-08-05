import { Colors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export default function Search({ query, onQueryChange }: SearchProps) {
  return (
    <View style={styles.flexRow}>
      <TextInput
        style={styles.input}
        placeholder="Chercher un event, un utilisateur..."
        value={query}
        onChangeText={onQueryChange}
        clearButtonMode="always"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Feather
        name="filter"
        size={20}
        color={Colors.light.icon}
        style={styles.iconFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    height: 44,
    paddingHorizontal: 16,
    width: 320,
    backgroundColor: "white",
    borderRadius: 22,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  iconFilter: {
    backgroundColor: "#dcdcdc",
    padding: 10,
    borderRadius: 25,
    marginLeft: 7,
  },
});
