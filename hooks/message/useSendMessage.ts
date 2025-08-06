// hooks/message/useSendMessage.ts
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SendMessageParams = {
  conversation_id: string;
  sender_id: string;
  content: string;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SendMessageParams) => {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: params.conversation_id,
          sender_id: params.sender_id,
          content: params.content,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      // Invalider les messages de cette conversation
      queryClient.invalidateQueries({
        queryKey: ["messages", data.conversation_id],
      });
      
      // Invalider la liste des conversations pour mettre à jour le dernier message
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};