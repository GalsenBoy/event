// hooks/message/useMessages.ts
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useMessages = (conversationId?: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select("*, sender:profiles(id, username, avatar_url)")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!conversationId,
  });
};
