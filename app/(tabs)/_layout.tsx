import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import useUserProfile from "@/hooks/useUserProfile";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Platform } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { pathImage } = useUserProfile();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: "Carte",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="map-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="createAction"
        options={{
          title: "Créer",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="add-circle"  color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messenger"
        options={{
          title: "Discussions",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="chatbubble-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: Boolean(pathImage) ? "" : "Profil",
          tabBarIcon: ({ color }) => (
            <>
              {Boolean(pathImage) ? (
                <Image
                  source={{ uri: pathImage }}
                  style={{ width: 28, height: 28, borderRadius: 14 }}
                />
              ) : (
                <Ionicons size={24} name="person-outline" color={color} />
              )}
            </>
          ),
        }}
      />
    </Tabs>
  );
}
