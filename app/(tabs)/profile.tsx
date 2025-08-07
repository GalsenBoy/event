import { supabase } from "@/lib/supabaseClient";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import UserProfileHeader from "@/app/user/components/UserProfileHeader";
import Loading from "@/components/ui/Loading";
import { Colors } from "@/constants/Colors";
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

  // --- États pour la modale d'édition ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null); // URI locale de la nouvelle image

  // --- Récupération des données ---
  const { followersCount } = useFollowersCount(user?.id);
  const { followingCount } = useFollowingCount(user?.id);

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select(`username, avatar_url, id, bio`)
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // --- Logique de la modale ---
  const openEditModal = () => {
    // Initialiser les champs de la modale avec les données actuelles du profil
    if (profile) {
      setUsernameInput(profile.username || "");
      setBioInput(profile.bio || "");
      setNewAvatarUri(null); // Réinitialiser l'aperçu de l'image
      setIsModalVisible(true);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewAvatarUri(result.assets[0].uri);
    }
  };

  // --- Mutation pour la mise à jour (simplifiée) ---
  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (updates: { username: string; bio: string; avatar_url: string; }) => {
      if (!user) throw new Error("Utilisateur non connecté !");
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        updated_at: new Date(),
        ...updates,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
      setIsModalVisible(false);
      Alert.alert("Succès", "Profil mis à jour !");
    },
    onError: (error) => {
      Alert.alert("Erreur", error.message);
    },
  });

const handleSave = async () => {
  try {
    let finalAvatarPath = profile?.avatar_url || "";

    if (newAvatarUri) {
      // Supprimer l'ancien fichier avatar s'il existe
      if (profile?.avatar_url) {
        await supabase.storage.from("avatars").remove([profile.avatar_url]);
      }

      // Uploader la nouvelle image
      const response = await fetch(newAvatarUri);
      const arrayBuffer = await response.arrayBuffer();
      const fileName = `${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Ne pas générer l'URL publique, on garde juste le nom de fichier
      finalAvatarPath = fileName;
    }

    // Mise à jour du profil avec uniquement le nom du fichier
    await updateProfile({
      username: usernameInput,
      bio: bioInput,
      avatar_url: finalAvatarPath,
    });

    setIsModalVisible(false);
    Alert.alert("Succès", "Profil mis à jour !");
  } catch (e: any) {
    Alert.alert("Erreur", e.message || "Une erreur s'est produite");
  }
};


  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/Auth");
    }
  }, [isAuthenticated]);
  if (loadingProfile || !profile) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le profil</Text>
            
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  newAvatarUri ? { uri: newAvatarUri } : (profile.avatar_url ? { uri: profile.avatar_url } : require("@/assets/images/biblio.jpg"))
                }
                style={styles.modalAvatar}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Pseudo"
              value={usernameInput}
              onChangeText={setUsernameInput}
            />
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Bio"
              multiline
              value={bioInput}
              onChangeText={setBioInput}
            />

            <View style={styles.modalButtons}>
              <Button
              buttonStyle={styles.cancel}
              titleStyle={{color:Colors.light.tint}}
                title="Annuler"
                onPress={() => setIsModalVisible(false)}
                type="outline"
              />
              <Button buttonStyle={styles.save} title="Sauvegarder" onPress={handleSave} loading={isUpdating} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <ScrollView>
        <View style={styles.container}>
          <UserProfileHeader
            action={true}
            avatarUrl={profile.avatar_url || ""}
            username={profile.username || "Utilisateur"}
            bio={profile.bio || ""}
            followers={followersCount || 0}
            following={followingCount || 0}
            groupCount={0} 
            onEdit={openEditModal} 
            onShare={() => console.log("Partager")}
          />
          <EventsTabs />
          <Button
            title="Déconnexion"
            onPress={() => supabase.auth.signOut()}
            containerStyle={{ marginTop: 30 }}
            buttonStyle={{ backgroundColor: 'red' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  // --- Styles de la Modale ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 20,
    backgroundColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancel:{
    borderColor:Colors.light.tint,
      borderRadius:5
  },
  save:{
    backgroundColor:Colors.customColor.blue,
    borderRadius:5
  }
});