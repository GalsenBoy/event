import Avatar from "@/components/auth/Avatar";
import { useAuth } from "@/context/AuthContext"; // Important: utiliser le hook d'authentification
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

// Schéma de validation Zod pour le profil
const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Le pseudo doit contenir au moins 3 caractères.")
    .max(25, "Le pseudo ne peut pas dépasser 25 caractères."),
  full_name: z.string().min(3, "Le nom complet est requis."),
  bio: z
    .string()
    .max(200, "La biographie est trop longue (200 caractères max).")
    .optional(),
  avatar_url: z.string().nullable().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CompleteProfile() {
  const { user } = useAuth(); // Utiliser le contexte pour obtenir l'utilisateur
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Mettre à jour l'URL de l'avatar dans le formulaire lorsque l'upload est terminé
  useEffect(() => {
    setValue("avatar_url", null); // Initialisation
  }, [setValue]);

  const handleAvatarUpload = (path: string) => {
    setValue("avatar_url", path);
  };

  const onSubmit = async (formData: ProfileFormData) => {
    if (!user) {
      Alert.alert("Erreur", "Utilisateur non connecté.");
      return;
    }
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      Alert.alert("Profil complété !", "Bienvenue !");
      router.replace("/(tabs)"); // Remplacer pour empêcher le retour en arrière
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Finalisez votre profil</Text>
        <Text style={styles.subHeader}>
          Ces informations seront visibles par les autres.
        </Text>
      </View>

      <Controller
        control={control}
        name="avatar_url"
        render={({ field: { value } }) => (
         <Avatar
           url={value || null}
           size={120}
           onUpload={handleAvatarUpload}
           allowUpload={true}
         />
        )}
      />

      {/* --- Champ Pseudo --- */}
      <Text style={styles.label}>Pseudo</Text>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Votre nom d'artiste ou pseudo"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username.message}</Text>
      )}

      {/* --- Champ Nom Complet --- */}
      <Text style={styles.label}>Nom complet</Text>
      <Controller
        control={control}
        name="full_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Ex: Jean Dupont"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.full_name && (
        <Text style={styles.errorText}>{errors.full_name.message}</Text>
      )}

      {/* --- Champ Biographie --- */}
      <Text style={styles.label}>Biographie (optionnel)</Text>
      <Controller
        control={control}
        name="bio"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Parlez un peu de vous, de vos passions..."
            multiline
            onBlur={onBlur}
            onChangeText={onChange}
            value={value || ""}
          />
        )}
      />
      {errors.bio && <Text style={styles.errorText}>{errors.bio.message}</Text>}

      {/* --- Bouton de soumission --- */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Terminer l'inscription</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- Styles ---
const PRIMARY_COLOR = "#FF6347";
const BORDER_COLOR = "#ddd";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 8,
    color: "#555",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
