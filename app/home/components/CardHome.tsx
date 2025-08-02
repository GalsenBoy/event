import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons"; // ou Ionicons, FontAwesome etc.

import { GlobalStyle } from "@/constants/GlobalStyle";
import { useAuth } from "@/context/AuthContext";
import {
  useIsEventSaved,
  useToggleSaveEvent,
} from "@/hooks/event/useSaveEvent";
import { Event } from "@/types/evenType";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CardHome({ event }: { event?: Event }) {
  const { user } = useAuth();
  const { data: isSaved } = useIsEventSaved(event?.id ?? "", user?.id ?? "");
  const toggleSave = useToggleSaveEvent(event?.id ?? "", user?.id);
  return (
    <View style={styles.container}>
      <View style={{ position: "relative" }}>
        <TouchableOpacity onPress={() => router.push(`/event/${event?.id}`)}>
          <Image source={{ uri: event?.photo_url  }} style={styles.image} />
        </TouchableOpacity>

        <Ionicons
          name={isSaved ? "heart" : "heart-outline"}
          size={28}
          color={isSaved ? Colors.light.tint : Colors.light.background}
          style={{ position: "absolute", top: 10, left: 15 }}
          onPress={(e) => {
            e.stopPropagation(), toggleSave.mutate(isSaved);
          }}
        />

        <Feather
          name="share-2"
          size={24}
          color={Colors.light.background}
          style={{ position: "absolute", top: 10, right: 15 }}
        />
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        <View style={[styles.flexRow, { marginTop: 7, marginBottom: 5 }]}>
          <View>
            <ThemedText type="defaultSemiBold">
              {event ? event.name : "Titre de l'événement"}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.date}>
              {event
                ? new Intl.DateTimeFormat("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Paris",
                  }).format(new Date(event.start_datetime))
                : "01/01/2023"}
            </ThemedText>
          </View>
          <ThemedText type="defaultSemiBold">
            {!event?.price ? "Gratuit" : `${event?.price} €`}
          </ThemedText>
        </View>
        <View style={styles.flexRow}>
          <ThemedText>
            <Text style={{ color: Colors.light.icon }}>Par </Text>
            <ThemedText
              style={styles.pseudoUser}
              onPress={() => router.push(`/user/${event?.user_id}`)}
              type="defaultSemiBold"
            >
              @{event?.profiles?.username ?? "inconnu"}{" "}
            </ThemedText>
            <ThemedText type="defaultSemiBold">0.8km</ThemedText>
          </ThemedText>
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
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: GlobalStyle.borderRadius.borderRadius,
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
  date: {
    color: Colors.light.tint,
  },
  pseudoUser: {
    color: Colors.customColor.blue,
  },
});
