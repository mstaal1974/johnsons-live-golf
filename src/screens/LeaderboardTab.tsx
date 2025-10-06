import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGameStore } from "../state/gameStore";
import { Avatar } from "../components/Avatar";
import { LeaderboardEntry } from "../types/golf";
import { getOpenAIChatResponse } from "../api/chat-service";

export const LeaderboardTab: React.FC = () => {
  const showScoreType = useGameStore((s) => s.showScoreType);
  const setShowScoreType = useGameStore((s) => s.setShowScoreType);
  const tournament = useGameStore((s) => s.tournament);
  const players = useGameStore((s) => s.players);
  const teams = useGameStore((s) => s.teams);
  const playerScores = useGameStore((s) => s.playerScores);
  const teamScores = useGameStore((s) => s.teamScores);
  const selectedDay = useGameStore((s) => s.selectedDay);

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryNotes, setSummaryNotes] = useState("");
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [generating, setGenerating] = useState(false);

  // Calculate leaderboard entries
  const getLeaderboard = (): LeaderboardEntry[] => {
    if (!tournament) return [];

    const entries: LeaderboardEntry[] = [];

    if (tournament.gameMode === "Individual") {
      // Individual leaderboard
      players.forEach((player) => {
        const scores = playerScores.filter(
          (s) => s.playerId === player.uid && (!selectedDay || s.dayId === selectedDay)
        );

        const totalStrokes = scores.reduce((sum, s) => sum + s.totalStrokes, 0);
        const totalPoints = scores.reduce((sum, s) => sum + s.totalPoints, 0);

        if (scores.length > 0) {
          entries.push({
            id: player.uid,
            name: player.fullName,
            grossScore: totalStrokes,
            stablefordPoints: totalPoints,
            handicap: player.handicap,
          });
        }
      });
    } else {
      // Ambrose leaderboard
      teams.forEach((team) => {
        const scores = teamScores.filter(
          (s) => s.teamId === team.id && (!selectedDay || s.dayId === selectedDay)
        );

        const totalStrokes = scores.reduce((sum, s) => sum + s.totalStrokes, 0);
        const totalPoints = scores.reduce((sum, s) => sum + s.totalPoints, 0);

        if (scores.length > 0) {
          entries.push({
            id: team.id,
            name: team.name,
            grossScore: totalStrokes,
            stablefordPoints: totalPoints,
            handicap: team.teamHandicap,
            isTeam: true,
            playerIds: team.playerIds,
          });
        }
      });
    }

    // Sort by score type
    return entries.sort((a, b) => {
      if (showScoreType === "gross") {
        return a.grossScore - b.grossScore;
      } else {
        return b.stablefordPoints - a.stablefordPoints;
      }
    });
  };

  const leaderboard = getLeaderboard();

  const handleGenerateSummary = async () => {
    if (!tournament || leaderboard.length === 0) return;

    setGenerating(true);
    try {
      const topThree = leaderboard.slice(0, 3);
      const prompt = `Generate a concise and engaging tournament summary for "${
        tournament.name
      }" held on ${new Date().toLocaleDateString()}. 

Top performers:
${topThree
  .map(
    (entry, i) =>
      `${i + 1}. ${entry.name} - ${entry.stablefordPoints} points (${
        entry.grossScore
      } strokes)`
  )
  .join("\n")}

Additional notes: ${summaryNotes || "None"}

Write a brief, exciting summary (2-3 sentences) highlighting the key moments and standout performances.`;

      const response = await getOpenAIChatResponse(prompt);

      setGeneratedSummary(response.content);
    } catch (error) {
      console.error("Error generating summary:", error);
      setGeneratedSummary("Failed to generate summary. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Leaderboard
        </Text>
        {tournament && (
          <Text className="text-sm text-gray-600">{tournament.name}</Text>
        )}
      </View>

      {/* Controls */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-medium text-gray-700">
            {showScoreType === "gross" ? "Gross Score" : "Stableford Points"}
          </Text>
          <Switch
            value={showScoreType === "stableford"}
            onValueChange={(value) =>
              setShowScoreType(value ? "stableford" : "gross")
            }
            trackColor={{ false: "#d1d5db", true: "#10b981" }}
            thumbColor="white"
          />
        </View>

        {leaderboard.length > 0 && (
          <Pressable
            onPress={() => setShowSummaryModal(true)}
            className="bg-blue-600 rounded-lg py-3 flex-row items-center justify-center"
          >
            <Ionicons name="sparkles" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">
              Generate AI Summary
            </Text>
          </Pressable>
        )}
      </View>

      {/* Leaderboard */}
      <ScrollView className="flex-1">
        {leaderboard.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="trophy-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-center mt-4 text-base">
              No scores recorded yet
            </Text>
            <Text className="text-gray-400 text-center mt-2 text-sm">
              Start entering scores to see the leaderboard
            </Text>
          </View>
        ) : (
          <View className="p-4">
            {leaderboard.map((entry, index) => (
              <View
                key={entry.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm flex-row items-center"
              >
                {/* Position */}
                <View className="w-10 items-center mr-3">
                  {index < 3 ? (
                    <Ionicons
                      name="trophy"
                      size={24}
                      color={
                        index === 0
                          ? "#fbbf24"
                          : index === 1
                          ? "#9ca3af"
                          : "#92400e"
                      }
                    />
                  ) : (
                    <Text className="text-lg font-bold text-gray-600">
                      {index + 1}
                    </Text>
                  )}
                </View>

                {/* Avatar & Name */}
                <View className="flex-1 flex-row items-center">
                  <Avatar name={entry.name} size="md" />
                  <View className="ml-3 flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                      {entry.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      Handicap: {entry.handicap.toFixed(1)}
                    </Text>
                  </View>
                </View>

                {/* Score */}
                <View className="items-end">
                  <Text className="text-2xl font-bold text-green-600">
                    {showScoreType === "gross"
                      ? entry.grossScore
                      : entry.stablefordPoints}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {showScoreType === "gross" ? "strokes" : "points"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* AI Summary Modal */}
      <Modal
        visible={showSummaryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSummaryModal(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="bg-white border-b border-gray-200 px-6 py-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">
              AI Tournament Summary
            </Text>
            <Pressable onPress={() => setShowSummaryModal(false)}>
              <Ionicons name="close" size={28} color="#374151" />
            </Pressable>
          </View>

          <ScrollView className="flex-1 p-6">
            <Text className="text-base font-medium text-gray-700 mb-2">
              Add Notes (Optional)
            </Text>
            <TextInput
              className="bg-white rounded-lg p-4 mb-4 text-base border border-gray-300"
              placeholder="Any standout moments or performances to highlight?"
              value={summaryNotes}
              onChangeText={setSummaryNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Pressable
              onPress={handleGenerateSummary}
              disabled={generating}
              className={`rounded-lg py-4 mb-6 ${
                generating ? "bg-gray-400" : "bg-blue-600"
              }`}
            >
              {generating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-base">
                  Generate Summary
                </Text>
              )}
            </Pressable>

            {generatedSummary && (
              <View className="bg-white rounded-lg p-6 border border-gray-200">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="sparkles" size={24} color="#3b82f6" />
                  <Text className="text-lg font-bold text-gray-900 ml-2">
                    Generated Summary
                  </Text>
                </View>
                <Text className="text-base text-gray-700 leading-6">
                  {generatedSummary}
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
