import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Définir les types pour les commentaires et les profils associés
type CommentWithProfile = {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};

// Le composant principal pour la section des commentaires
export default function CommentSection({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  // 1. Récupérer les commentaires avec les infos du profil de l'auteur
  const { data: comments, isLoading } = useQuery<CommentWithProfile[]>({
    queryKey: ['comments', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`id, content, created_at, profiles(username, avatar_url)`)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!eventId,
  });

  // 2. Créer une mutation pour ajouter un nouveau commentaire
  const { mutate: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Vous devez être connecté pour commenter.');
      
      const { error } = await supabase.from('comments').insert({
        content,
        event_id: eventId,
        user_id: user.id,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // Rafraîchir la liste des commentaires après un ajout réussi
      queryClient.invalidateQueries({ queryKey: ['comments', eventId] });
      setNewComment(''); // Vider le champ de saisie
    },
    onError: (error) => {
      alert(`Erreur: ${error.message}`);
    },
  });

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(newComment.trim());
    }
  };

  const renderComment = ({ item }: { item: CommentWithProfile }) => (
    <View style={styles.commentContainer}>
      <Image 
        source={item.profiles?.avatar_url ? { uri: item.profiles.avatar_url } : require('@/assets/images/biblio.jpg')} 
        style={styles.avatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.username}>{item.profiles?.username || 'Utilisateur anonyme'}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Champ de saisie pour un nouveau commentaire */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} disabled={isAddingComment} style={styles.sendButton}>
          {isAddingComment ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Envoyer</Text>}
        </TouchableOpacity>
      </View>

      {/* Liste des commentaires */}
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Soyez le premier à commenter !</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
  sendButton: { backgroundColor: '#FF6347', borderRadius: 20, padding: 12 },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  commentContainer: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  commentContent: { flex: 1 },
  username: { fontWeight: 'bold', marginBottom: 3 },
  commentText: {},
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
});