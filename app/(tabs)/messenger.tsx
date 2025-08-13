import Avatar from "@/components/auth/Avatar";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useConversations } from "@/hooks/message/useConversation";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Messenger() {
  const { data: conversations, isLoading } = useConversations();
  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() =>
        router.push({
          pathname: `/chat/${item.id}`,
          params: {
            recipientId: item.other_user.id,
            recipientName: item.other_user.username,
          },
        })
      }
    >
      <Avatar size={50} url={item.other_user.avatar_url} />
      <View style={styles.conversationContent}>
        <ThemedText type="defaultSemiBold" style={styles.username}>{item.other_user.username}</ThemedText>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.last_message.content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Messages
      </ThemedText>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune conversation.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { paddingHorizontal: 16, marginBottom: 16 },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.icon,
  },
  conversationContent: { flex: 1, marginLeft: 15 },
  username: {  marginBottom: 4 },
  lastMessage: { color: "#666" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#888" },
});
