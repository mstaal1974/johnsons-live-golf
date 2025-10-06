import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGameStore } from "../state/gameStore";
import { sampleCourses } from "../data/sampleCourses";
import { Tournament, TournamentDay, GameMode } from "../types/golf";

export const AdminTab: React.FC = () => {
  const [tournamentName, setTournamentName] = useState("");
  
  const currentUser = useGameStore((s) => s.currentUser);
  const tournament = useGameStore((s) => s.tournament);
  const courses = useGameStore((s) => s.courses);
  const setTournament = useGameStore((s) => s.setTournament);
  const updateTournament = useGameStore((s) => s.updateTournament);
  const setCourses = useGameStore((s) => s.setCourses);
  const clearAllTournamentData = useGameStore((s) => s.clearAllTournamentData);
  const isSuperAdmin = useGameStore((s) => s.isSuperAdmin);

  const handleCreateTournament = () => {
    if (!tournamentName.trim()) {
      Alert.alert("Error", "Please enter a tournament name");
      return;
    }

    const newTournament: Tournament = {
      id: `tournament-${Date.now()}`,
      name: tournamentName.trim(),
      days: [],
      gameMode: "Individual",
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.uid || "unknown",
    };

    setTournament(newTournament);
    
    // Load sample courses if not already loaded
    if (courses.length === 0) {
      setCourses(sampleCourses);
    }

    Alert.alert("Success", "Tournament created!");
    setTournamentName("");
  };

  const handleAddDay = () => {
    if (!tournament) return;

    const newDay: TournamentDay = {
      id: `day-${Date.now()}`,
      date: new Date().toISOString(),
      courseId: sampleCourses[0].id,
    };

    const updatedDays = [...tournament.days, newDay];
    updateTournament({ days: updatedDays });
  };

  const handleToggleGameMode = () => {
    if (!tournament) return;
    const newMode: GameMode =
      tournament.gameMode === "Individual" ? "Ambrose" : "Individual";
    updateTournament({ gameMode: newMode });
  };

  const handleClearData = () => {
    Alert.alert(
      "⚠️ Danger Zone",
      "This will permanently delete all tournament data, scores, teams, and chat messages. This action cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: () => {
            clearAllTournamentData();
            Alert.alert("Success", "All tournament data has been cleared");
          },
        },
      ]
    );
  };

  if (!isSuperAdmin) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="lock-closed" size={64} color="#d1d5db" />
        <Text className="text-gray-500 text-center mt-4 text-base px-6">
          Admin access required
        </Text>
        <Text className="text-gray-400 text-center mt-2 text-sm px-6">
          Please authenticate as super admin
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">Admin</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Tournament Management
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Create Tournament */}
          {!tournament && (
            <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Create Tournament
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base"
                placeholder="Tournament name (e.g., Spring Classic 2025)"
                value={tournamentName}
                onChangeText={setTournamentName}
              />
              <Pressable
                onPress={handleCreateTournament}
                className="bg-green-600 rounded-lg py-3"
              >
                <Text className="text-white font-semibold text-center text-base">
                  Create Tournament
                </Text>
              </Pressable>
            </View>
          )}

          {/* Tournament Settings */}
          {tournament && (
            <>
              <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
                <Text className="text-lg font-bold text-gray-900 mb-4">
                  Tournament Details
                </Text>
                
                <View className="py-3 border-b border-gray-200">
                  <Text className="text-sm text-gray-600 mb-1">Name</Text>
                  <Text className="text-base font-medium text-gray-900">
                    {tournament.name}
                  </Text>
                </View>

                <View className="py-3 border-b border-gray-200">
                  <Text className="text-sm text-gray-600 mb-1">
                    Tournament Days
                  </Text>
                  <Text className="text-base font-medium text-gray-900">
                    {tournament.days.length}{" "}
                    {tournament.days.length === 1 ? "day" : "days"}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center py-3">
                  <View>
                    <Text className="text-sm text-gray-600 mb-1">
                      Game Mode
                    </Text>
                    <Text className="text-base font-medium text-gray-900">
                      {tournament.gameMode}
                    </Text>
                  </View>
                  <Switch
                    value={tournament.gameMode === "Ambrose"}
                    onValueChange={handleToggleGameMode}
                    trackColor={{ false: "#d1d5db", true: "#10b981" }}
                    thumbColor="white"
                  />
                </View>
              </View>

              {/* Tournament Days */}
              <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold text-gray-900">
                    Tournament Days
                  </Text>
                  <Pressable
                    onPress={handleAddDay}
                    className="bg-green-600 rounded-lg px-4 py-2"
                  >
                    <Text className="text-white font-semibold">Add Day</Text>
                  </Pressable>
                </View>

                {tournament.days.length === 0 ? (
                  <Text className="text-gray-500 text-center py-4">
                    No days added yet
                  </Text>
                ) : (
                  tournament.days.map((day, index) => {
                    const course = courses.find((c) => c.id === day.courseId);
                    return (
                      <View
                        key={day.id}
                        className="flex-row items-center justify-between py-3 border-b border-gray-100"
                      >
                        <View>
                          <Text className="text-base font-medium text-gray-900">
                            Day {index + 1}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {course?.name || "No course"}
                          </Text>
                        </View>
                        <Ionicons name="calendar" size={24} color="#10b981" />
                      </View>
                    );
                  })
                )}
              </View>

              {/* Danger Zone */}
              <View className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="warning" size={24} color="#ef4444" />
                  <Text className="text-lg font-bold text-red-900 ml-2">
                    Danger Zone
                  </Text>
                </View>
                <Text className="text-sm text-red-700 mb-4">
                  Permanently delete all tournament data, scores, teams, and
                  chat messages. This action cannot be undone.
                </Text>
                <Pressable
                  onPress={handleClearData}
                  className="bg-red-600 rounded-lg py-3"
                >
                  <Text className="text-white font-semibold text-center text-base">
                    Clear All Tournament Data
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          {/* Courses Info */}
          <View className="bg-white rounded-xl p-6 mt-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Available Courses
            </Text>
            {courses.length === 0 ? (
              <Text className="text-gray-500 text-center py-4">
                No courses loaded. Create a tournament to load sample courses.
              </Text>
            ) : (
              courses.map((course) => (
                <View
                  key={course.id}
                  className="py-3 border-b border-gray-100"
                >
                  <Text className="text-base font-medium text-gray-900">
                    {course.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Par {course.totalPar} • {course.holes.length} holes
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
