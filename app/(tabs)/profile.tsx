import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import Avatar from "@/components/auth/Avatar";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Button, Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export default function Profile({ session }: { session: Session }) {

  const queryClient = useQueryClient();
  

  // États locaux pour gérer les champs de saisie
  const [username, setUsername] = useState("");

  // Récupération du profil
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["userProfile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
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

  const handleAvatarUpload = async (newUrl: string) => {
    try {
      if (profile?.avatar_url) {
        await deleteAvatar(profile.avatar_url); // Supprimer l'ancien avatar
      }

      await updateProfile({
        username,
        avatar_url: newUrl,
      });

      Alert.alert("Succès", "Votre photo de profil a été mise à jour !");
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de mettre à jour l'avatar"
      );
    }
  };

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

  return (
   
  <ScrollView>
    <KeyboardAvoidingView style={styles.container}>
      <ThemedText
        style={{ textAlign: "center", marginVertical: 24 }}
        type="title"
      >
        Mon Compte
      </ThemedText>

      {/* Section haut du profil comme Instagram */}
      <View style={styles.profileHeader}>
        <Avatar
          size={100}
          url={profile?.avatar_url || ""}
          onUpload={handleAvatarUpload}
        />
        <View style={styles.profileInfo}>
          <ThemedText style={styles.username}>
            {username || "Pseudo"}
          </ThemedText>
          <ThemedText style={styles.email}>
            {session?.user?.email}
          </ThemedText>
        </View>
      </View>

      {/* Formulaire de mise à jour */}
      <View style={styles.inputContainer}>
        <Input
          label="Pseudo ou Kunya"
          value={username}
          leftIcon={
            <Ionicons
              name="person-outline"
              size={24}
              color={Colors.light.tint}
            />
          }
          placeholder="'Imran"
          onChangeText={setUsername}
        />
      </View>

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
  username: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#888",
  },
  inputContainer: {
    marginBottom: 24,
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
