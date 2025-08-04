import Avatar from "@/components/auth/Avatar";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

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
  const [newComment, setNewComment] = useState("");

  // 1. Récupérer les commentaires
  const {
    data: comments,
    isLoading,
    refetch,
  } = useQuery<CommentWithProfile[]>({
    queryKey: ["comments", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select(`id, content, created_at, profiles(username, avatar_url)`)
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!eventId,
  });

  // 2. Mutation pour ajouter un commentaire
  const { mutate: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Vous devez être connecté pour commenter.");

      const { error } = await supabase.from("comments").insert({
        content,
        event_id: eventId,
        user_id: user.id,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: async () => {
      await refetch(); // <- rafraîchir les commentaires
      setNewComment(""); // vider le champ
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
     <Avatar size={40} url={item.profiles?.avatar_url}/>
      <View style={styles.commentContent}>
        <ThemedText style={styles.username}>
          {item.profiles?.username || "Utilisateur anonyme"}
        </ThemedText>
        
        <ThemedText >{item.content}</ThemedText>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ajouter un commentaire..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              onPress={handleAddComment}
              disabled={isAddingComment}
              style={styles.sendButton}
            >
              {isAddingComment ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendButtonText}>Envoyer</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Liste des commentaires */}
          {isLoading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={comments}
              renderItem={renderComment}
              scrollEnabled={false} 
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Soyez le premier à commenter !
                </Text>
              }
              contentContainerStyle={{ paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#FF6347",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sendButtonText: { color: "#fff", fontWeight: "bold" },
  commentContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentContent: { marginLeft:10},
  username: { fontWeight: "bold", marginBottom: 3,fontSize:15,textTransform:"lowercase"},
  emptyText: { textAlign: "center", color: "#888", marginTop: 20 },
});
