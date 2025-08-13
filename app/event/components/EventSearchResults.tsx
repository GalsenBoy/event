import { ThemedText } from "@/components/ThemedText";
import { Event } from "@/types/eventType";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function EventSearchResultCard({ event }: { event: Event }) {
  const eventDate = new Date(event.start_datetime).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const background = useColorScheme() === "light" ? {backgroundColor:"#fff"} :  {backgroundColor:"#252525"}

  return (
    <TouchableOpacity 
      style={[eventCardStyles.container,background]}
      onPress={() => router.push(`/event/${event.id}`)}
    >
      <Image 
        source={event.photo_url ? { uri: event.photo_url } : require('@/assets/images/biblio.jpg')}
        style={eventCardStyles.image}
      />
      <View style={eventCardStyles.info}>
        <ThemedText type="defaultSemiBold" style={eventCardStyles.name} numberOfLines={2}>{event.name}</ThemedText>
        <Text style={eventCardStyles.date}>{eventDate}</Text>
      </View>
    </TouchableOpacity>
  );
}

const eventCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    marginBottom: 4,
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
});
