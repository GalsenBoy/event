import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/types/evenType";
import { useQuery } from "@tanstack/react-query";

export const useEventDetail = (eventId: string) => {
  return useQuery<Event & { profiles: { username: string; avatar_url?: string } }, Error>({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event")
        .select("*, profiles(username, avatar_url)")
        .eq("id", eventId)
        .single(); // 👈 pour un seul résultat

      if (error) throw error;
      return data;
    },
  });
};
