import { ThemedText } from "@/components/ThemedText";
import Loading from "@/components/ui/Loading";
import { useEventDetail } from "@/hooks/useEventDetail";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import CardHome from "../home/components/CardHome";

export default function DetailsEvent() {
  const { id: eventId } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading, isError } = useEventDetail(eventId);

  if (isLoading) return <Loading />;
  if (isError || !event) return <ThemedText>Erreur de chargement</ThemedText>;

  return (
    <View style={styles.container}>
      <CardHome event={event} />
      <ThemedText>Details of event {eventId} </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
