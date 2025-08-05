import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Assurez-vous que ce type correspond à la structure de vos données événement
type Event = {
  id: string;
  name: string;
  photo_url: string | null;
  start_datetime: string;
};

export function EventSearchResultCard({ event }: { event: Event }) {
  const eventDate = new Date(event.start_datetime).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <TouchableOpacity 
      style={eventCardStyles.container}
      onPress={() => router.push(`/event/${event.id}`)} // Navigue vers les détails de l'événement
    >
      <Image 
        source={event.photo_url ? { uri: event.photo_url } : require('@/assets/images/biblio.jpg')}
        style={eventCardStyles.image}
      />
      <View style={eventCardStyles.info}>
        <Text style={eventCardStyles.name} numberOfLines={2}>{event.name}</Text>
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
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
});
