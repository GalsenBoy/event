
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useFollowingCount(user_id?: string) {

  const {
    data: followingCount,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["followingCount", user_id],
    queryFn: async () => {
      if (!user_id) return 0;

      const { count, error: countError } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user_id);

      if (countError) {
        console.error("Erreur récupération following count:", countError);
        return 0;
      }

      return count ?? 0;
    },
    enabled: !!user_id,
  });

  return {
    followingCount,
    isLoading,
    error,
  };
}
