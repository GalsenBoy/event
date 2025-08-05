import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import useUserProfile from "@/hooks/useUserProfile";
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
            <IconSymbol size={28} name="house" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: "Carte",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="createAction"
        options={{
          title: "Créer",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus.circle.fill"  color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messenger"
        options={{
          title: "Discussions",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message" color={color} />
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
                <IconSymbol size={28} name="person" color={color} />
              )}
            </>
          ),
        }}
      />
    </Tabs>
  );
}
