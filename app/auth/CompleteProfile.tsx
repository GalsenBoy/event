import Avatar from "@/components/auth/Avatar";
import { supabase } from "@/lib/supabaseClient";
import { Button, Input } from "@rneui/themed";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

export default function CompleteProfile() {
  const [pseudo, setPseudo] = useState("");
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Vérifier la session au montage du composant
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      Alert.alert("Erreur", "Session expirée. Veuillez vous reconnecter.");
      router.push("/auth/Auth");
      return;
    }
    
    setUser(session.user);
  }

  async function handleSubmit() {
    if (!user) {
      Alert.alert("Erreur", "Utilisateur non connecté.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: pseudo,
      avatar_url: avatarPath,
    });

    if (error) {
      Alert.alert("Erreur", error.message);
    } else {
      Alert.alert("Succès", "Profil complété !");
      router.push("/(tabs)");
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Avatar
          size={120}
          url={null}
          onUpload={(path) => setAvatarPath(path)}
        />
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
          disabled={loading || !pseudo || !user}
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