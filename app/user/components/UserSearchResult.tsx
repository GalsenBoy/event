import Avatar from "@/components/auth/Avatar";
import { ThemedText } from "@/components/ThemedText";
import { Profiles } from "@/types/eventType";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";


export default function UserSearchResultCard({ user }: { user: Profiles }) {
    const background = useColorScheme() === "light" ? {backgroundColor:"#fff"} :  {backgroundColor:"#252525"}
  
  return (
    <TouchableOpacity
      style={[userCardStyles.container,background]}
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
