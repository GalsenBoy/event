import Avatar from "@/components/auth/Avatar";
import { supabase } from "@/lib/supabaseClient";
import { Button, Input } from "@rneui/themed";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

export default function CompleteProfile() {
  const [pseudo, setPseudo] = useState("");
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Erreur", "Utilisateur non connecté.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: pseudo,
      avatar_url: avatarPath,
    });

    if (error) {
      Alert.alert("Erreur", error.message);
    } else {
      Alert.alert("Succès", "Profil complété !");
      // Rediriger vers la page d'accueil ou dashboard
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
     <ScrollView>
         <Avatar size={120} url={null} onUpload={(path) => setAvatarPath(path)} />
      <Input
        label="Pseudo"
        value={pseudo}
        onChangeText={setPseudo}
        placeholder="Choisis ton pseudo"
        containerStyle={{ marginTop: 20 }}
      />
      <Button
        title="Terminer"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || !pseudo}
      />
     </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
});
