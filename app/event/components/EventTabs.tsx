import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import CreatedEvents from "./CreatedEvents";
import SavedEvents from "./SavedEvents";

export default function EventsTabs() {
  const [activeTab, setActiveTab] = useState<"saved" | "created">("saved");

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "saved" && styles.activeTab]}
          onPress={() => setActiveTab("saved")}
        >
          <ThemedText style={[styles.tabText, activeTab === "saved" && styles.activeText]}>
            Événements sauvegardés
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "created" && styles.activeTab]}
          onPress={() => setActiveTab("created")}
        >
          <ThemedText style={[styles.tabText, activeTab === "created" && styles.activeText]}>
            Événements créés
          </ThemedText>
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
    borderColor: Colors.light.icon,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: Colors.light.tint,
  },
  tabText: {
    fontSize: 14,
    color: "#888",
  },
  activeText: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});
