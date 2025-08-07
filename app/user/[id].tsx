import UserProfileHeader from "@/app/user/components/UserProfileHeader";
import { ThemedText } from "@/components/ThemedText";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/context/AuthContext";
import { useFollow } from "@/hooks/useFollow";
import { useFollowersCount } from "@/hooks/useFollowersCount";
import { useFollowingCount } from "@/hooks/useFollowingCount";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import getButtonAppearance from "./components/GetButtonAppearrance";
import UserTabs from "./components/UserTabs";

export default function PublicProfile() {
  const { id: user_id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  if (!user_id) return <ThemedText>Utilisateur introuvable</ThemedText>;
  const { followersCount, isLoading } = useFollowersCount(user_id);
  const { followingCount } = useFollowingCount(user_id);
  const { isFollowing, toggleFollow } = useFollow(user_id);
  const { text, style, textStyle } = getButtonAppearance(user_id);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["userProfile", user_id],
    queryFn: async () => {
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url,bio`)
        .eq("id", user_id)
        .single();

      if (error && status !== 406) throw new Error(error.message);
      return data || { username: "", avatar_url: "", bio: "" };
    },
    enabled: !!user_id,
  });

  if (!user_id) return <ThemedText>Utilisateur introuvable</ThemedText>;
  if (loadingProfile) return <Loading />;

  const handleSendMessage = async () => {
    if (!user || !user_id || !profile) return;
    setIsCreatingChat(true);

    try {
      // 1. Vérifier si une conversation existe déjà
      const { data: existingConversation, error: fetchError } = await supabase
        .from("conversations")
        .select("id")
        .contains("participant_ids", [user.id, user_id]);

      // Gérer les erreurs potentielles, sauf si aucune ligne n'est trouvée
      if (fetchError) throw fetchError;

      if (existingConversation && existingConversation.length > 0) {
        // 2a. Naviguer vers la conversation existante
        router.push({
          pathname: `/chat/${existingConversation[0].id}`,
          params: { recipientId: user_id, recipientName: profile.username },
        });
      } else {
        // 2b. Créer une nouvelle conversation
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert({ participant_ids: [user.id, user_id] })
          .select("id")
          .single();

        if (createError) throw createError;
        if (!newConversation)
          throw new Error("La création de la conversation a échoué.");

        router.push({
          pathname: `/chat/${newConversation.id}`,
          params: { recipientId: user_id, recipientName: profile.username },
        });
      }
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de démarrer la conversation."
      );
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <View style={styles.container}>
      <UserProfileHeader
        action={false}
        avatarUrl={profile?.avatar_url || ""}
        username={profile?.username || "Mathie"}
        bio={profile?.bio || ""}
        followers={followersCount || 0}
        following={followingCount || 0}
        groupCount={profile?.groupCount || 3}
      />
      {user?.id !== user_id && (
        <View>
          <TouchableOpacity
            style={[styles.buttonBase, style]}
            onPress={toggleFollow}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={isFollowing ? "#333" : "#fff"} />
            ) : (
              <Text style={textStyle}>{text}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonBase, styles.messageButton]}
            onPress={handleSendMessage}
            disabled={isCreatingChat}
          >
            {isCreatingChat ? (
              <ActivityIndicator color="#333" />
            ) : (
              <Text style={styles.messageButtonText}>Envoyer un message</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      <UserTabs id={user_id} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonBase: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44,
  },
  messageButton: {
    backgroundColor: "#E5E5EA",
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  messageButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
