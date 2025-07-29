import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import Loading from "@/components/ui/Loading";
import UserProfileHeader from "@/components/UserProfileHeader";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@rneui/themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export default function Profile() {
  const queryClient = useQueryClient();
  const { session, user, isAuthenticated } = useAuth();
  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    // Logique pour éditer le profil
  };
  const handleShareProfile = () => {
    console.log("Share profile clicked");
    // Logique pour partager le profil
  };

  // États locaux pour gérer les champs de saisie
  const [username, setUsername] = useState("");

  // Récupération du profil
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["userProfile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url,id`)
        .eq("id", session.user.id)
        .single();

      if (error && status !== 406) throw new Error(error.message);

      // Mettre à jour les états locaux lors du chargement du profil
      if (data) setUsername(data.username || "");

      return data || { username: "", avatar_url: "" };
    },
    enabled: !!session?.user?.id,
  });

  // Mutation pour la mise à jour du profil
  const { mutateAsync: updateProfile, isPending: updatingProfile } =
    useMutation({
      mutationFn: async ({
        username,
        avatar_url,
      }: {
        username: string;
        avatar_url: string;
      }) => {
        if (!session?.user) throw new Error("No user on the session!");

        const updates = {
          id: session.user.id,
          username,
          avatar_url,
          updated_at: new Date(),
        };

        const { error } = await supabase.from("profiles").upsert(updates);

        if (error) throw new Error(error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["userProfile", session?.user?.id]);
        router.replace("/(tabs)");
      },
    });

  // Mutation pour supprimer l'ancien avatar
  const { mutateAsync: deleteAvatar } = useMutation({
    mutationFn: async (avatarUrl: string) => {
      const fileName = avatarUrl.split("/").pop();
      if (!fileName) throw new Error("Invalid avatar URL");

      const { error } = await supabase.storage
        .from("avatars")
        .remove([fileName]);

      if (error) throw new Error("Failed to delete old avatar");
    },
  });

  // Dans votre composant React Native

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        username,
        avatar_url: profile?.avatar_url || "",
      });
      Alert.alert("Succès", "Profil mis à jour avec succès !");
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de mettre à jour le profil"
      );
    }
  };
  if (!isAuthenticated) {
    router.replace("/auth/Auth");
    return null;
  }
    if (session === undefined) return <Loading />;
  

  if (!profile) return <Loading />;
  

  return (
    <ScrollView>
      <KeyboardAvoidingView style={styles.container}>
        <ThemedText
          style={{ textAlign: "center", marginVertical: 24 }}
          type="title"
        >
          Mon Compte
        </ThemedText>
        <UserProfileHeader
          avatarUrl={profile?.avatar_url || ""}
          username={user?.user_metadata?.username || "Mathie"}
          bio={profile?.bio || ""}
          followers={profile?.followers || 12}
          following={profile?.following || 1}
          groupCount={profile?.groupCount || 3}
          onEdit={handleEditProfile}
          onShare={handleShareProfile}
        />

        <View style={styles.buttonContainer}>
          <Button
            title={
              loadingProfile || updatingProfile
                ? "Chargement..."
                : "Mettre à jour"
            }
            onPress={handleUpdateProfile}
            disabled={loadingProfile || updatingProfile}
            titleStyle={styles.buttonText}
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 25,
    paddingHorizontal: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 30,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
});
