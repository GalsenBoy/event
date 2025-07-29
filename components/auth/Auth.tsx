import { Colors } from "@/constants/Colors";
import { supabase } from "@/lib/supabaseClient";
import { Button, Input } from "@rneui/themed";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View,
} from "react-native";

const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const url = Linking.useURL();
  useEffect(() => {
    if (url)
      createSessionFromUrl(url).catch((err) => setErrorMessage(err.message));
  }, [url]);

  async function signInWithEmail() {
    setLoading(true);
    //ajouter si l'utilisateur est connecté rediriger vers la page d'accueil
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert("Erreur", error.message);
      setLoading(false);
      return;
    }
    if (session) {
      router.push("/(tabs)");
    } else {
      Alert.alert("Connexion réussie", "Bienvenue !");
      router.push("/auth/CompleteProfile");
    }
    setLoading(false);
  }

  const disabled = !email || password.length < 6;

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${redirectTo}/auth/Auth`,
      },
    });
    if (error) Alert.alert("Erreur", error.message);
    if (!session)
      Alert.alert(
        "Inscription réussie",
        "Vérifie ta boîte mail pour confirmer ton adresse."
      );
    setLoading(false);
    if (!session) {
      Alert.alert(
        "Inscription réussie",
        "Vérifie ta boîte mail pour confirmer ton adresse."
      );
      router.push("/auth/CompleteProfile");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.form}>
        <Input
          label="Adresse e-mail"
          leftIcon={{ type: "feather", name: "mail", color: Colors.light.icon }}
          onChangeText={setEmail}
          value={email}
          placeholder="ex: johndoe@gmail.com"
          autoCapitalize="none"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
        />
        <Input
          label="Mot de passe"
          leftIcon={{ type: "feather", name: "lock", color: Colors.light.icon }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="*********"
          autoCapitalize="none"
          inputStyle={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
        />

        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.light.tint}
            style={{ marginVertical: 20 }}
          />
        ) : (
          <>
            <Button
              title="Se connecter"
              buttonStyle={styles.primaryButton}
              titleStyle={styles.buttonText}
              onPress={signInWithEmail}
              containerStyle={styles.buttonContainer}
              disabled={disabled}
            />
            <Button
              title="Créer un compte"
              type="outline"
              buttonStyle={styles.secondaryButton}
              titleStyle={styles.secondaryText}
              onPress={signUpWithEmail}
              containerStyle={styles.buttonContainer}
              disabled={disabled}
            />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  form: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#444",
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputText: {
    fontSize: 16,
    color: "#000",
  },
  buttonContainer: {
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryButton: {
    borderColor: Colors.light.tint,
    borderWidth: 1.5,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFF",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryText: {
    color: Colors.light.tint,
    fontWeight: "600",
    fontSize: 16,
  },
});
