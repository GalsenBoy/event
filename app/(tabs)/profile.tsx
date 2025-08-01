import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import Loading from "@/components/ui/Loading";
import UserProfileHeader from "@/components/UserProfileHeader";
import { useAuth } from "@/context/AuthContext";
import { useFollowersCount } from "@/hooks/useFollowersCount";
import { useFollowingCount } from "@/hooks/useFollowingCount";
import { Button } from "@rneui/themed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import EventsTabs from "../event/components/EventTabs";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { followersCount } = useFollowersCount(user?.id);
  const { followingCount } = useFollowingCount(user?.id);
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
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user on the ");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url, id, bio`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) throw new Error(error.message);

      // Mettre à jour les états locaux lors du chargement du profil
      if (data) setUsername(data.username || "");

      return data || { username: "", avatar_url: "" };
    },
    enabled: !!user?.id,
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
        if (!user) throw new Error("No user on the session!");

        const updates = {
          id: user.id,
          username,
          avatar_url,
          updated_at: new Date(),
        };

        const { error } = await supabase.from("profiles").upsert(updates);

        if (error) throw new Error(error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["userProfile", user?.id]);
        router.replace("/(tabs)");
      },
    });

  //if (isLoading) return <Loading />;

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
  if (user === undefined) return <Loading />;

  if (!profile) return <Loading />;

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView style={styles.container}>
          <UserProfileHeader
            action={true}
            avatarUrl={profile?.avatar_url || ""}
            username={profile?.username || "Mathie"}
            bio={profile?.bio || ""}
            followers={followersCount || 0}
            following={followingCount || 0}
            groupCount={profile?.groupCount || 3}
            onEdit={handleEditProfile}
            onShare={handleShareProfile}
          />
          <EventsTabs />
          <View>
            <Button
              title="Déconnexion"
              onPress={() => {
                supabase.auth.signOut();
                router.replace("/auth/Auth");
              }}
              titleStyle={styles.buttonText}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
