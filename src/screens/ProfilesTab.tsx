import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGameStore } from "../state/gameStore";
import { Avatar } from "../components/Avatar";

export const ProfilesTab: React.FC = () => {
  const players = useGameStore((s) => s.players);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">Profiles</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {players.length} {players.length === 1 ? "player" : "players"}
        </Text>
      </View>

      <ScrollView className="flex-1">
        {players.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="person-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-center mt-4 text-base">
              No players yet
            </Text>
          </View>
        ) : (
          <View className="p-4">
            {players.map((player) => (
              <View
                key={player.uid}
                className="bg-white rounded-xl p-6 mb-3 shadow-sm flex-row items-center"
              >
                <Avatar name={player.fullName} size="lg" />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    {player.fullName}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {player.email}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="golf" size={16} color="#10b981" />
                    <Text className="text-sm text-gray-700 ml-2">
                      Handicap: {player.handicap}
                    </Text>
                  </View>
                  {!player.emailVerified && (
                    <View className="flex-row items-center mt-2">
                      <Ionicons name="warning" size={16} color="#f59e0b" />
                      <Text className="text-xs text-amber-600 ml-2">
                        Email not verified
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
