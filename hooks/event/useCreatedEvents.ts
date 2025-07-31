import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useCreatedEvents() {
  const {user} = useAuth();

  return useQuery({
    queryKey: ["created-events", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("event")
        .select("*, profiles(username)")
        .eq("user_id", user.id)
        .order("start_datetime", { ascending: true });

      if (error) throw error;

      return data;
    },
    enabled: !!user,
  });
}
