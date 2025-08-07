import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useCreatedEvents(user_id:string) {

  return useQuery({
    queryKey: ["created-events",user_id],
    queryFn: async () => {
      if (!user_id) return [];

      const { data, error } = await supabase
        .from("event")
        .select("*, profiles(username)")
        .eq("user_id", user_id)
        .order("start_datetime", { ascending: true });

      if (error) throw error;

      return data;
    },
    enabled: !!user_id,
  });
}
