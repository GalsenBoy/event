import DisplayPrivateEvents from "@/app/home/components/DisplayPrivateEvents";
import DisplayPublicEvents from "@/app/home/components/DisplayPublicEvents";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";



export default function EventsVisibilityTabs() {
  const colorScheme = useColorScheme();
  const borderColor = colorScheme === "dark"
              ? { borderColor: Colors.dark.text }
              : { borderColor: Colors.light.text }
  const colorText = colorScheme === "dark"
              ? { color: Colors.dark.text }
              : { color: Colors.light.text };

  const [activeTab, setActiveTab] = useState<"saved" | "created">("saved");

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "saved" && styles.activeTab,
            borderColor,
           
          ]}
          onPress={() => setActiveTab("saved")}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "saved" && styles.activeText,
              colorText,
            ]}
          >
            Événements publics
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "created" && styles.activeTab,
            borderColor,
          ]}
          onPress={() => setActiveTab("created")}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "created" && styles.activeText,
              colorText,
            ]}
          >
            Événements privés
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Contenu selon l’onglet actif */}
      <View style={{ flex: 1,padding: 10 }}>
        {activeTab === "saved" ? <DisplayPublicEvents /> : <DisplayPrivateEvents />}
      </View>
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
    //borderColor: colorScheme === "dark" ? Colors.dark.tint : Colors.light.tint,
  },
  tabText: {
    fontSize: 14,
    color: "#888",
  },
  activeText: {
    //color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
    fontWeight: "bold",
  },
});
