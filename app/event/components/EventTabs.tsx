import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CreatedEvents from "./CreatedEvents";
import SavedEvents from "./SavedEvents";

export default function EventsTabs() {
  const [activeTab, setActiveTab] = useState<"saved" | "created">("saved");

  return (
    <View style={{ flex: 1 }}>
      {/* Onglets */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "saved" && styles.activeTab]}
          onPress={() => setActiveTab("saved")}
        >
          <Text style={[styles.tabText, activeTab === "saved" && styles.activeText]}>
            Événements sauvegardés
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "created" && styles.activeTab]}
          onPress={() => setActiveTab("created")}
        >
          <Text style={[styles.tabText, activeTab === "created" && styles.activeText]}>
            Événements créés
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenu selon l’onglet actif */}
      <ScrollView style={{ padding: 10 }}>
        {activeTab === "saved" ? <SavedEvents /> : <CreatedEvents />}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#007bff",
  },
  tabText: {
    fontSize: 14,
    color: "#888",
  },
  activeText: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
