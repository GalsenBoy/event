import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/hooks/message/useMessage";
import { useSendMessage } from "@/hooks/message/useSendMessage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    StyleSheet as ChatStyleSheet,
    Text as ChatText,
    TouchableOpacity as ChatTouchableOpacity,
    View as ChatView,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from "react-native";
import { SafeAreaView as ChatSafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { id: conversationId, recipientName } = useLocalSearchParams<{
    id: string;
    recipientName: string;
  }>();
  const { user } = useAuth(); 
  const { data: messages, isLoading } = useMessages(conversationId); 
  const [inputText, setInputText] = useState("");
  
  // Utilisation correcte du hook
  const sendMessageMutation = useSendMessage();

  const handleSendMessage = async () => {
    if (!inputText.trim() || !conversationId || !user?.id) return;
    
    try {
      await sendMessageMutation.mutateAsync({
        conversation_id: conversationId,
        sender_id: user.id,
        content: inputText.trim(),
      });
      setInputText(""); // Vider l'input après envoi
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.sender_id === user?.id 
    return (
      <ChatView
        style={[
          chatStyles.messageBubble,
          isMyMessage ? chatStyles.myMessage : chatStyles.theirMessage,
        ]}
      >
        <ChatText
          style={
            isMyMessage ? chatStyles.myMessageText : chatStyles.theirMessageText
          }
        >
          {item.content}
        </ChatText>
      </ChatView>
    );
  };

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <ChatSafeAreaView style={chatStyles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={chatStyles.messageList}
          inverted // Affiche les messages du bas vers le haut
        />
        <ChatView style={chatStyles.inputContainer}>
          <TextInput
            style={chatStyles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Message à ${recipientName}...`}
            multiline
            onSubmitEditing={handleSendMessage}
          />
          <ChatTouchableOpacity
            style={[
              chatStyles.sendButton,
              { opacity: inputText.trim() ? 1 : 0.5 }
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || sendMessageMutation.isLoading}
          >
            {sendMessageMutation.isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={24} color="white" />
            )}
          </ChatTouchableOpacity>
        </ChatView>
      </KeyboardAvoidingView>
    </ChatSafeAreaView>
  );
}
const chatStyles = ChatStyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  messageList: { paddingHorizontal: 10 },
  messageBubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 8,
    maxWidth: "80%",
  },
  myMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  myMessageText: { color: "white" },
  theirMessageText: { color: "black" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
