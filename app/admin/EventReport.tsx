import { ThemedText } from "@/components/ThemedText";
import Loading from "@/components/ui/Loading";
import { Colors } from "@/constants/Colors";
import { useDeleteEvent } from "@/hooks/event/useDeleteEvent";
import { useEventReports } from "@/hooks/event/useReportEvent";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";



export default function EventReportsScreen() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useEventReports(page);
  const deleteEvent = useDeleteEvent();
  const cardBackgroundColor = useColorScheme() === "light" ? {backgroundColor:"#fff"} : {backgroundColor:"#252525"}

  if (isLoading) return <Loading />;

  const handleDelete = (eventId: string) => {
    Alert.alert(
      "Supprimer l'événement",
      "Voulez-vous vraiment supprimer cet événement ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => deleteEvent.mutate(eventId),
        },
      ]
    );
  };

  const renderReportItem = ({ item }: any) => (
    <View style={[styles.card,cardBackgroundColor]}>
      <ThemedText style={styles.eventTitle}>
        Événement : {item.event.name}
      </ThemedText>
      <ThemedText style={styles.detailText}>
        <ThemedText type="defaultSemiBold">Ville :</ThemedText>{" "}
        {item.event.address_city}
      </ThemedText>
      <ThemedText style={styles.detailText}>
        <ThemedText type="defaultSemiBold">Signalé par :</ThemedText>{" "}
        {item.reporter.username}
      </ThemedText>
      <ThemedText style={styles.detailText}>
        <ThemedText type="defaultSemiBold">Raison :</ThemedText>{" "}
        {item.reason}
      </ThemedText>
      <ThemedText style={styles.dateText}>
        {new Date(item.created_at).toLocaleString("fr-FR")}
      </ThemedText>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.event.id)}
      >
        <Text style={styles.deleteButtonText}>Supprimer l'événement</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.data || []}
        keyExtractor={(item) => item.id}
        renderItem={renderReportItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <ThemedText type="subtitle" style={styles.headerTitle}>Signalements d'événements</ThemedText>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <ThemedText type="defaultSemiBold">Aucun signalement trouvé.</ThemedText>
          </View>
        )}
        ListFooterComponent={() =>
          data?.total && data.total > 10 ? (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.pageButton, page === 1 && styles.disabledButton]}
                disabled={page === 1}
                onPress={() => setPage((p) => p - 1)}
              >
                <ThemedText type="defaultSemiBold">Précédent</ThemedText>
              </TouchableOpacity>
              <ThemedText type="defaultSemiBold">Page {page}</ThemedText>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  page * 10 >= (data?.total ?? 0) && styles.disabledButton,
                ]}
                disabled={page * 10 >= (data?.total ?? 0)}
                onPress={() => setPage((p) => p + 1)}
              >
                <ThemedText type="defaultSemiBold">Suivant</ThemedText>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  headerTitle: {
    
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 20,
  },

  dateText: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    textAlign: "right",
  },
  deleteButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  deleteButtonText: {
    color: Colors.light.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  pageButton: {
    backgroundColor: Colors.light.icon,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#A5C9FF",
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  });
