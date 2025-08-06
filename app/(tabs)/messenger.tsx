import Avatar from "@/components/auth/Avatar";
import { ThemedText } from "@/components/ThemedText";
import { useAuth } from "@/context/AuthContext";
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
  const { user } = useAuth();
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
        <Text style={styles.username}>{item.other_user.username}</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  title: { paddingHorizontal: 16, marginBottom: 16 },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  conversationContent: { flex: 1, marginLeft: 15 },
  username: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  lastMessage: { color: "#666" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#888" },
});
