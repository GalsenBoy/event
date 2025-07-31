// useSavedEvents.ts
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useIsEventSaved = (eventId: string, userId?: string) => {
  return useQuery({
    queryKey: ["isSaved", eventId],
    enabled: !!eventId && !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_event")
        .select("*")
        .eq("user_id", userId)
        .eq("event_id", eventId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return !!data;
    },
  });
};

export const useToggleSaveEvent = (eventId: string, userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isSaved: boolean) => {
      if (!userId) throw new Error("User not logged in");
      if (isSaved) {
        // remove
        const { error } = await supabase
          .from("saved_event")
          .delete()
          .eq("user_id", userId)
          .eq("event_id", eventId);
        if (error) throw error;
      } else {
        // save
        const { error } = await supabase.from("saved_event").insert({
          user_id: userId,
          event_id: eventId,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["isSaved", eventId]);
      queryClient.invalidateQueries(["savedCount", eventId]);
    },
  });
};

export const useSavedCount = (eventId: string) => {
  return useQuery({
    queryKey: ["savedCount", eventId],
    enabled: !!eventId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("saved_event")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId);
      if (error) throw error;
      return count ?? 0;
    },
  });
};
