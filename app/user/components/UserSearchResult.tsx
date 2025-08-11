import Avatar from "@/components/auth/Avatar";
import { ThemedText } from "@/components/ThemedText";
import { Profiles } from "@/types/eventType";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export default function UserSearchResultCard({ user }: { user: Profiles }) {
  return (
    <TouchableOpacity
      style={userCardStyles.container}
      onPress={() => router.push(`/user/${user.id}`)}
    >
      <Avatar url={user.avatar_url} size={50} />
      <View style={userCardStyles.info}>
        <ThemedText type="defaultSemiBold">{user.username}</ThemedText>
        {user.full_name && (
          <Text style={userCardStyles.fullName}>{user.full_name}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const userCardStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  info: {
    flex: 1,
    marginLeft: 7,
  },
  fullName: {
    color: "#666",
    fontSize: 14,
  },
});
