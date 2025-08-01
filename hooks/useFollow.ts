import { useAuth } from '@/context/AuthContext'; // Suppose que vous avez un hook d'authentification
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Hook pour gérer la logique de suivi (follow/unfollow) d'un utilisateur.
 * @param targetUserId - L'ID de l'utilisateur que l'on souhaite suivre ou ne plus suivre.
 */
export function useFollow(targetUserId: string | undefined) {
  const { user: currentUser } = useAuth(); // Obtenir l'utilisateur actuellement connecté
  const queryClient = useQueryClient();

  const currentUserId = currentUser?.id;

  // Clé de requête unique pour le statut de suivi
  const queryKey = ['followStatus', currentUserId, targetUserId];

  // ## ÉTAPE 1: Récupérer le statut de suivi initial
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
    // La requête ne s'active que si les deux IDs sont présents
    enabled: !!currentUserId && !!targetUserId,
  });


  // ## ÉTAPE 2: Créer la mutation pour suivre/se désabonner
  const { mutate: toggleFollow, isPending: isToggleLoading } = useMutation({
    mutationFn: async (isCurrentlyFollowing: boolean) => {
      if (!currentUserId || !targetUserId) throw new Error('Utilisateur non défini.');

      if (isCurrentlyFollowing) {
        // --- Action de Unfollow ---
        const { error } = await supabase.from('follows').delete().match({
          follower_id: currentUserId,
          following_id: targetUserId,
        });
        if (error) throw error;
      } else {
        // --- Action de Follow ---
        const { error } = await supabase.from('follows').insert({
          follower_id: currentUserId,
          following_id: targetUserId,
        });
        if (error) throw error;
      }
    },
    
    // ## ÉTAPE 3: Mettre à jour l'UI instantanément (Mise à jour optimiste)
    onMutate: async (isCurrentlyFollowing) => {
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey });

      // Sauvegarder l'état précédent en cas d'erreur
      const previousStatus = queryClient.getQueryData<boolean>(queryKey);

      // Mettre à jour l'état dans le cache de React Query de manière optimiste
      queryClient.setQueryData(queryKey, !isCurrentlyFollowing);

      // Retourner les données précédentes pour le rollback
      return { previousStatus };
    },
    onError: (_err, _variables, context) => {
      // En cas d'erreur, revenir à l'état précédent
      if (context?.previousStatus !== undefined) {
        queryClient.setQueryData(queryKey, context.previousStatus);
      }
    },
    onSettled: () => {
      // Re-synchroniser avec le serveur une fois la mutation terminée
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    isFollowing,
    toggleFollow: () => {
      // Ne pas permettre l'action si l'état initial n'est pas encore chargé
      if (isFollowing !== undefined) {
        toggleFollow(isFollowing);
      }
    },
    isLoading: isStatusLoading || isToggleLoading,
  };
}