import { Colors } from "@/constants/Colors";
import { useFollow } from "@/hooks/useFollow";
import { StyleSheet } from "react-native";

export default function getButtonAppearance(user_id: string) {
  const { isFollowing } = useFollow(user_id);
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
}

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: Colors.customColor.blue,
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
});
