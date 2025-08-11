import Avatar from "@/components/auth/Avatar";
import { ThemedText } from "@/components/ThemedText";
import { CommentWithProfile } from "@/types/evenType";
import { StyleSheet, View } from "react-native";


export const renderComment = ({ item }: { item: CommentWithProfile }) => (
  <View style={styles.commentContainer}>
    <Avatar size={40} url={item.profiles?.avatar_url} />
    <View style={styles.commentContent}>
      <ThemedText style={styles.username}>
        {item.profiles?.username || "Utilisateur anonyme"}
      </ThemedText>

      <ThemedText>{item.content}</ThemedText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentContent: { marginLeft: 10 },
  username: {
    fontWeight: "bold",
    marginBottom: 3,
    fontSize: 15,
    textTransform: "lowercase",
  },
});
