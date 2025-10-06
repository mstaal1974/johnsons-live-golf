import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGameStore } from "../state/gameStore";
import { Avatar } from "../components/Avatar";
import { ChatMessage } from "../types/golf";

export const ChatTab: React.FC = () => {
  const [messageText, setMessageText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const currentUser = useGameStore((s) => s.currentUser);
  const chatMessages = useGameStore((s) => s.chatMessages);
  const addChatMessage = useGameStore((s) => s.addChatMessage);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatMessages.length]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !currentUser) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.uid,
      senderName: currentUser.fullName,
      message: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    addChatMessage(newMessage);
    setMessageText("");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">Chat</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {chatMessages.length} {chatMessages.length === 1 ? "message" : "messages"}
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        >
          {chatMessages.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="chatbubbles-outline" size={64} color="#d1d5db" />
              <Text className="text-gray-500 text-center mt-4 text-base">
                No messages yet
              </Text>
              <Text className="text-gray-400 text-center mt-2 text-sm">
                Start a conversation with your group
              </Text>
            </View>
          ) : (
            chatMessages.map((msg) => {
              const isOwnMessage = msg.senderId === currentUser?.uid;

              return (
                <View
                  key={msg.id}
                  className={`flex-row mb-4 ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isOwnMessage && (
                    <Avatar name={msg.senderName} size="sm" />
                  )}
                  <View
                    className={`max-w-[75%] ${isOwnMessage ? "mr-0" : "ml-3"}`}
                  >
                    {!isOwnMessage && (
                      <Text className="text-xs text-gray-600 mb-1 ml-2">
                        {msg.senderName}
                      </Text>
                    )}
                    <View
                      className={`rounded-2xl px-4 py-3 ${
                        isOwnMessage ? "bg-green-600" : "bg-white"
                      }`}
                    >
                      <Text
                        className={`text-base ${
                          isOwnMessage ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {msg.message}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-400 mt-1 ml-2">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  {isOwnMessage && (
                    <Avatar name={msg.senderName} size="sm" />
                  )}
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Message Input */}
        <View className="bg-white border-t border-gray-200 px-4 py-3">
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base mr-2"
              placeholder="Type a message..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
            />
            <Pressable
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
              className={`w-12 h-12 rounded-full items-center justify-center ${
                messageText.trim() ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <Ionicons
                name="send"
                size={20}
                color="white"
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
