import { useAuth } from '@/context/AuthContext'; // Suppose que vous avez un hook d'authentification
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Hook pour gérer la logique de suivi (follow/unfollow) d'un utilisateur.
 * @param targetUserId - L'ID de l'utilisateur que l'on souhaite suivre ou ne plus suivre.
 */
export function useFollow(targetUserId: string | undefined) {
  const { user: currentUser } = useAuth(); 
  const queryClient = useQueryClient();

  const currentUserId = currentUser?.id;

  const queryKey = ['followStatus', currentUserId, targetUserId];

  const { data: isFollowing, isLoading: isStatusLoading } = useQuery({
    queryKey: queryKey,
    queryFn: async (): Promise<boolean> => {
      if (!currentUserId || !targetUserId) return false;

      const { error, count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', currentUserId)
        .eq('following_id', targetUserId);
      
      if (error) throw new Error(error.message);

      return count === 1;
    },
    enabled: !!currentUserId && !!targetUserId,
  });


  const { mutate: toggleFollow, isPending: isToggleLoading } = useMutation({
    mutationFn: async (isCurrentlyFollowing: boolean) => {
      if (!currentUserId || !targetUserId) throw new Error('Utilisateur non défini.');

      if (isCurrentlyFollowing) {
        const { error } = await supabase.from('follows').delete().match({
          follower_id: currentUserId,
          following_id: targetUserId,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('follows').insert({
          follower_id: currentUserId,
          following_id: targetUserId,
        });
        if (error) throw error;
      }
    },
    
    onMutate: async (isCurrentlyFollowing) => {
      await queryClient.cancelQueries({ queryKey });
      const previousStatus = queryClient.getQueryData<boolean>(queryKey);
      queryClient.setQueryData(queryKey, !isCurrentlyFollowing);
      return { previousStatus };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(queryKey, context.previousStatus);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    isFollowing,
    toggleFollow: () => {
      if (isFollowing !== undefined) {
        toggleFollow(isFollowing);
      }
    },
    isLoading: isStatusLoading || isToggleLoading,
  };
}