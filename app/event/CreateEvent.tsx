import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import uuid from "react-native-uuid";
import { z } from "zod";

// Schéma Zod complet
const schema = z.object({
  name: z.string().min(3, "Le nom doit faire au moins 3 caractères").max(100),
  start_datetime: z.string().min(1, "Date de début requise"),
  end_datetime: z.string().min(1, "Date de fin requise"),
  price: z.string().optional(),
  description: z.string().min(10, "La description doit faire au moins 10 caractères").max(1000),
  address_street: z.string().min(1, "Rue requise"),
  address_postal: z.string().min(5, "Code postal invalide").max(5, "Code postal invalide"),
  address_city: z.string().min(1, "Ville requise"),
  address_extra: z.string().optional(),
  visibility: z.enum(["public", "private"], { required_error: "La visibilité est requise" }),
  event_type: z.enum(
    ["anniversaire", "randonnée", "inauguration", "ventes_enchères"],
    { required_error: "Le type d'événement est requis" }
  ),
});

// Type pour les données du formulaire
type EventFormData = z.infer<typeof schema>;

export default function CreateEventForm() {
  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<EventFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      visibility: "public", // Valeur par défaut
    },
  });

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

const uploadImageToSupabase = async (uri: string) => {
  try {
    // Vérifier que l'utilisateur est bien connecté
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Utilisateur non authentifié");
    }

    // Étape 1 : Décoder l'URI pour éviter les problèmes de format de chemin
    const decodedUri = decodeURIComponent(uri);
    
    // Étape 2 : Générer un nom de fichier unique avec l'ID utilisateur
    const filename = `${session.user.id}/${uuid.v4()}.jpeg`;
    
    // Étape 3 : Lire le fichier comme ArrayBuffer (plus fiable que FormData)
    const response = await fetch(decodedUri);
    const arrayBuffer = await response.arrayBuffer();
    
    // Étape 4 : Uploader le fichier vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('event')
      .upload(filename, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false // Éviter d'écraser un fichier existant
      });
    
    if (error) {
      console.error("Erreur Supabase Storage:", error);
      throw error;
    }
    
    // Étape 5 : Récupérer l'URL publique du fichier uploadé
    const { data: publicUrlData } = supabase.storage
      .from("event")
      .getPublicUrl(filename);
    
    return publicUrlData.publicUrl;
    
  } catch (error) {
    console.error("Erreur détaillée de l'upload: ", error);
    
    // Messages d'erreur plus explicites
    if (error.message?.includes('row-level security policy')) {
      throw new Error("Permissions insuffisantes pour uploader le fichier");
    } else if (error.message?.includes('not found')) {
      throw new Error("Bucket de stockage non trouvé");
    } else {
      throw error;
    }
  }
};
 const onSubmit = async (formData: EventFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // 1. Récupérer l'utilisateur actuellement connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour créer un événement.");
      }

      // 2. Gérer l'upload de l'image
      let photo_url: string | null = null;
      if (imageUri) {
        photo_url = await uploadImageToSupabase(imageUri);
      }

      // 3. Insérer les données AVEC l'ID de l'utilisateur
      const { error } = await supabase.from("event").insert([
        {
          ...formData,
          user_id: user.id, // <-- Ligne ajoutée !
          photo_url,
          price: formData.price || null,
          start_datetime: new Date(formData.start_datetime).toISOString(),
          end_datetime: new Date(formData.end_datetime).toISOString(),
        },
      ]);

      if (error) throw new Error(error.message);
      
      alert("Événement créé avec succès ! ✨");
      reset();
      setImageUri(null);
    } catch (error: any) {
      console.error(error);
      alert(`Erreur: ${error.message || "Impossible de créer l'événement."}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Surveiller les valeurs pour mettre à jour l'UI des sélecteurs
  const selectedVisibility = watch("visibility");
  const selectedEventType = watch("event_type");

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.header}>Créer un événement</Text>
      
      {/* --- Champ Nom --- */}
      <Text style={styles.label}>Nom de l’événement</Text>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Ex: Super Randonnée au Lac"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      {/* --- Champ Description --- */}
      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Décrivez votre événement en quelques mots..."
            multiline
            numberOfLines={4}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

      {/* --- Sélecteur de Type --- */}
      <Text style={styles.label}>Type d'événement</Text>
      <Controller
        control={control}
        name="event_type"
        render={({ field: { onChange } }) => (
          <View style={styles.selectorContainer}>
            {["anniversaire", "randonnée", "inauguration", "ventes_enchères"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => onChange(type)}
                style={[styles.selectorButton, selectedEventType === type && styles.selectorButtonSelected]}
              >
                <Text style={[styles.selectorButtonText, selectedEventType === type && styles.selectorButtonTextSelected]}>
                  {type.replace("_", " ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
      {errors.event_type && <Text style={styles.errorText}>{errors.event_type.message}</Text>}

      {/* --- Dates --- */}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Date & Heure de début</Text>
          <Controller
            control={control}
            name="start_datetime"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="AAAA-MM-JJTHH:MM" value={value} onChangeText={onChange} />
            )}
          />
          {errors.start_datetime && <Text style={styles.errorText}>{errors.start_datetime.message}</Text>}
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Date & Heure de fin</Text>
          <Controller
            control={control}
            name="end_datetime"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="AAAA-MM-JJTHH:MM" value={value} onChangeText={onChange} />
            )}
          />
           {errors.end_datetime && <Text style={styles.errorText}>{errors.end_datetime.message}</Text>}
        </View>
      </View>

      {/* --- Adresse --- */}
      <Text style={styles.label}>Adresse</Text>
      <Controller
        control={control}
        name="address_street"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="N° et nom de la rue" value={value} onChangeText={onChange} />
        )}
      />
       {errors.address_street && <Text style={styles.errorText}>{errors.address_street.message}</Text>}
      <View style={styles.row}>
        <View style={styles.halfWidth}>
           <Controller
            control={control}
            name="address_postal"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Code Postal" value={value} onChangeText={onChange} keyboardType="number-pad" maxLength={5} />
            )}
          />
           {errors.address_postal && <Text style={styles.errorText}>{errors.address_postal.message}</Text>}
        </View>
        <View style={styles.halfWidth}>
           <Controller
            control={control}
            name="address_city"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Ville" value={value} onChangeText={onChange} />
            )}
          />
           {errors.address_city && <Text style={styles.errorText}>{errors.address_city.message}</Text>}
        </View>
      </View>
       <Controller
        control={control}
        name="address_extra"
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder="Bâtiment, étage, etc. (optionnel)" value={value} onChangeText={onChange} />
        )}
      />

      {/* --- Prix & Visibilité --- */}
       <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Tarif (€)</Text>
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} placeholder="Gratuit si vide" value={value} onChangeText={onChange} keyboardType="numeric" />
            )}
          />
        </View>
        <View style={styles.halfWidth}>
            <Text style={styles.label}>Visibilité</Text>
             <Controller
              control={control}
              name="visibility"
              render={({ field: { onChange } }) => (
                <View style={styles.selectorContainerSmall}>
                  <TouchableOpacity onPress={() => onChange("public")} style={[styles.selectorButtonSmall, selectedVisibility === 'public' && styles.selectorButtonSelected]}>
                    <Text style={[styles.selectorButtonText, selectedVisibility === 'public' && styles.selectorButtonTextSelected]}>Public</Text>
                  </TouchableOpacity>
                   <TouchableOpacity onPress={() => onChange("private")} style={[styles.selectorButtonSmall, selectedVisibility === 'private' && styles.selectorButtonSelected]}>
                    <Text style={[styles.selectorButtonText, selectedVisibility === 'private' && styles.selectorButtonTextSelected]}>Privé</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
        </View>
      </View>

      {/* --- Image Picker --- */}
      <Text style={styles.label}>Photo de l'événement</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>Choisir une image...</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      
      {/* --- Bouton de soumission --- */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Créer l’événement</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// --- Styles ---
const PRIMARY_COLOR = '#FF6347'; // Tomato
const BORDER_COLOR = '#ddd';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  selectorButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  selectorButtonSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  selectorButtonText: {
    color: '#333',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  selectorButtonTextSelected: {
    color: '#fff',
  },
  selectorContainerSmall: {
     flexDirection: 'row',
     height: 50,
     gap: 10
  },
  selectorButtonSmall: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: BORDER_COLOR
  },
  imagePicker: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#555',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});