import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useFollowersCount(user_id?: string) {

  const {
    data: followersCount,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["followersCount", user_id],
    queryFn: async () => {
      if (!user_id) return 0;

      const { count, error: countError } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user_id);

      if (countError) {
        console.error("Erreur récupération followers count:", countError);
        return 0;
      }

      return count ?? 0;
    },
    enabled: !!user_id,
  });

  return {
    followersCount,
    isLoading,
    error,
  };
}
