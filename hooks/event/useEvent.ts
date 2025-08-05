import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/evenType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useEvents = (visibility: "public" | "private") => {
  const queryClient = useQueryClient();

  const {
    data: events,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Event[], Error>({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event")
        .select(
          "name,price,start_datetime,photo_url,user_id,id,profiles(username)"
        )
        .eq("visibility", visibility)
        .order("start_datetime", { ascending: true })
        .limit(7);
      if (error) throw error;
      return data as Event[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase.from("event").delete().eq("id", eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err: any) => {
      Alert.alert("Erreur", err.message || "Échec de la suppression");
    },
  });

  const deleteEvent = (id: string) => {
    Alert.alert("Supprimer", "Confirmer la suppression de l'événement ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        onPress: () => deleteMutation.mutate(id),
        style: "destructive",
      },
    ]);
  };

  return {
    events,
    isLoading,
    isError,
    error,
    refetch,
    deleteEvent,
    isDeleting: deleteMutation.isPending,
  };
};
