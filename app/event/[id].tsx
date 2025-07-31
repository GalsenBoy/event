import { ThemedText } from "@/components/ThemedText";
import Loading from "@/components/ui/Loading";
import { Colors } from "@/constants/Colors";
import { GlobalStyle } from "@/constants/GlobalStyle";
import { useEventDetail } from "@/hooks/event/useEventDetail";
import { useSavedCount } from "@/hooks/event/useSaveEvent";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import CardHome from "../home/components/CardHome";

export default function DetailsEvent() {
  const { id: eventId } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading, isError } = useEventDetail(eventId);
  const { data: savedCount } = useSavedCount(eventId ?? "");


  if (isLoading) return <Loading />;
  if (isError || !event) return <ThemedText>Erreur de chargement</ThemedText>;

  return (
    <View style={styles.container}>
      <CardHome event={event} />
      <View style={styles.bar}></View>
      <ThemedText type="defaultSemiBold">Infos</ThemedText>
      <ThemedText>
        {event.address_street}, {event.address_postal} {event.address_city}{" "}
      </ThemedText>
      <ThemedText>
        Sauvegarder par{" "}
        <ThemedText
          style={{ color: Colors.customColor.blue }}
          type="defaultSemiBold"
        >
          {savedCount ? `${savedCount} personnes` : "Aucune personne"}
        </ThemedText>
      </ThemedText>
      <ThemedText style={{ marginTop: 15 }} type="defaultSemiBold">
        Description
      </ThemedText>
      <ThemedText>
        {event.description || "Aucune description disponible."}
      </ThemedText>
      <View style={[styles.bar,{marginVertical:10}]}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  bar: {
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: GlobalStyle.borderRadius.borderRadius,
  },
});
