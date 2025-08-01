import { ThemedText } from "@/components/ThemedText";
import Loading from "@/components/ui/Loading";
import UserProfileHeader from "@/components/UserProfileHeader";
import { useAuth } from "@/context/AuthContext";
import { useFollow } from "@/hooks/useFollowStatus";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PublicProfile() {
  const { id: user_id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  if (!user_id) return <ThemedText>Utilisateur introuvable</ThemedText>;
  const { isFollowing, toggleFollow, isLoading } = useFollow(user_id);

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    // Logique pour éditer le profil
  };
  const handleShareProfile = () => {
    console.log("Share profile clicked");
    // Logique pour partager le profil
  };

  const getButtonAppearance = () => {
    if (isFollowing) {
      return {
        text: "Abonné",
        style: styles.unfollowButton,
        textStyle: styles.unfollowButtonText,
      };
    }
    return {
      text: "Suivre",
      style: styles.followButton,
      textStyle: styles.followButtonText,
    };
  };

  const { text, style, textStyle } = getButtonAppearance();

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["userProfile", user_id],
    queryFn: async () => {
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url,bio`)
        .eq("id", user_id)
        .single();

      if (error && status !== 406) throw new Error(error.message);
      return data || { username: "", avatar_url: "" };
    },
    enabled: !!user_id,
  });

  if (!user_id) return <ThemedText>Utilisateur introuvable</ThemedText>;
  if (loadingProfile) return <Loading />;

  return (
    <View style={styles.container}>
      <UserProfileHeader
        action={false}
        avatarUrl={profile?.avatar_url || ""}
        username={profile?.username || "Mathie"}
        bio={profile?.bio || ""}
        followers={profile?.followers || 12}
        following={profile?.following || 1}
        groupCount={profile?.groupCount || 3}
        onEdit={handleEditProfile}
        onShare={handleShareProfile}
      />
      {user?.id !== user_id && (
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
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  followButton: {
    backgroundColor: "#007AFF", // Bleu
  },
  followButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  unfollowButton: {
    backgroundColor: "#E5E5EA", // Gris clair
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  unfollowButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonBase: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 44,
  },
});
