// hooks/chat/useConversations.ts
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useConversations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          messages(
            id,
            content,
            created_at,
            sender_id
          )
        `)
        .contains("participant_ids", [user.id])
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const conversationsWithProfiles = await Promise.all(
        (data || []).map(async (conversation) => {
          const otherUserId = conversation.participant_ids?.find(id => id !== user.id);
          
          let otherUser = null;
          if (otherUserId) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("id, username, avatar_url, full_name")
              .eq("id", otherUserId)
              .single();
            
            otherUser = profileData;
          }

          const lastMessage = conversation.messages?.[0] || null;

          return {
            ...conversation,
            other_user: otherUser,
            last_message: lastMessage
          };
        })
      );

      return conversationsWithProfiles;
    },
    enabled: !!user?.id,
  });
};