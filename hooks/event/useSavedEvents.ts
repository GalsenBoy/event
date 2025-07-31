import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { SavedEvent } from "@/types/evenType";
import { useQuery } from "@tanstack/react-query";

export function useSavedEvents() {
  const {user} = useAuth();

  return useQuery<SavedEvent[]>({
    queryKey: ["saved-events", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("saved_event")
        .select("event(*, profiles(username, avatar_url))")
        .eq("user_id", user.id);

      if (error) throw error;

      return data.map((item) => item.event) as SavedEvent[];
    },
    enabled: !!user,
  });
}
