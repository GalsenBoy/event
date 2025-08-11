import { supabase } from "@/lib/supabaseClient";
import { SavedEvent } from "@/types/eventType";
import { useQuery } from "@tanstack/react-query";

export function useSavedEvents(user_id:string) {

  return useQuery<SavedEvent[]>({
    queryKey: ["saved-events",user_id],
    queryFn: async () => {
      if (!user_id) return [];

      const { data, error } = await supabase
        .from("saved_event")
        .select("event(*, profiles(username, avatar_url))")
        .eq("user_id",user_id);

      if (error) throw error;

      return data.map((item) => item.event) as SavedEvent[];
    },
    enabled: !!user_id,
  });
}
