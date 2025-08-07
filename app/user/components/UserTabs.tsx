import Groups from "@/app/group/Groups";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useState } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import CreatedUserEvents from "./CreatedUserEvents";
import SavedUserEvents from "./SavedUserEvents";

interface UserTabsProps {
  id: string;
}

export default function UserTabs({ id }: UserTabsProps) {
  const colorScheme = useColorScheme();
  const borderColor =
    colorScheme === "dark"
      ? { borderColor: Colors.dark.text }
      : { borderColor: Colors.light.text };
  const colorText =
    colorScheme === "dark"
      ? { color: Colors.dark.text }
      : { color: Colors.light.text };

  const [activeTab, setActiveTab] = useState<"saved" | "created" | "groups">(
    "saved"
  );

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
            Événements sauvegardés
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
            Événements créés
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "groups" && styles.activeTab,
            borderColor,
          ]}
          onPress={() => setActiveTab("groups")}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === "groups" && styles.activeText,
              colorText,
            ]}
          >
            Groupes
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, padding: 10 }}>
        {activeTab === "saved" ? (
          <SavedUserEvents user_id={id} />
        ) : activeTab === "created" ? (
          <CreatedUserEvents user_id={id} />
        ) : (
          <Groups />
        )}
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
  },
  tabText: {
    fontSize: 14,
    color: "#888",
  },
  activeText: {
    fontWeight: "bold",
  },
});
