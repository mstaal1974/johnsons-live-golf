import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGameStore } from "../state/gameStore";
import { ScoreInput } from "../components/ScoreInput";
import { HoleScore } from "../types/golf";
import {
  calculateStablefordPoints,
  getScoreDescription,
  shouldCelebrate,
} from "../utils/golfUtils";

export const ScorecardTab: React.FC = () => {
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0);

  const currentUser = useGameStore((s) => s.currentUser);
  const tournament = useGameStore((s) => s.tournament);
  const courses = useGameStore((s) => s.courses);
  const selectedDay = useGameStore((s) => s.selectedDay);
  const teams = useGameStore((s) => s.teams);
  const playerScores = useGameStore((s) => s.playerScores);
  const teamScores = useGameStore((s) => s.teamScores);
  const addPlayerScore = useGameStore((s) => s.addPlayerScore);
  const updatePlayerScore = useGameStore((s) => s.updatePlayerScore);
  const addTeamScore = useGameStore((s) => s.addTeamScore);
  const updateTeamScore = useGameStore((s) => s.updateTeamScore);

  if (!tournament || !selectedDay || !currentUser) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="golf-outline" size={64} color="#d1d5db" />
        <Text className="text-gray-500 text-center mt-4 text-base px-6">
          {!tournament
            ? "No tournament active. Please create one in Admin tab."
            : !selectedDay
            ? "Please select a tournament day"
            : "Please sign in to enter scores"}
        </Text>
      </SafeAreaView>
    );
  }

  const day = tournament.days.find((d) => d.id === selectedDay);
  if (!day) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500 text-center mt-4 text-base px-6">
          Tournament day not found
        </Text>
      </SafeAreaView>
    );
  }

  const course = courses.find((c) => c.id === day.courseId);
  if (!course) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500 text-center mt-4 text-base px-6">
          Course not found. Please configure the course in Admin tab.
        </Text>
      </SafeAreaView>
    );
  }

  // Determine who is scoring
  let scoringFor = currentUser.fullName;
  let scoringId = currentUser.uid;
  let handicap = currentUser.handicap;
  let isTeamScoring = false;

  if (tournament.gameMode === "Ambrose") {
    const userTeam = teams.find((t) => t.playerIds.includes(currentUser.uid));
    if (userTeam) {
      scoringFor = userTeam.name;
      scoringId = userTeam.id;
      handicap = userTeam.teamHandicap;
      isTeamScoring = true;
    }
  }

  // Get current scores
  const existingScores = isTeamScoring
    ? teamScores.find((s) => s.teamId === scoringId && s.dayId === selectedDay)
    : playerScores.find((s) => s.playerId === scoringId && s.dayId === selectedDay);

  const [holeScores, setHoleScores] = useState<HoleScore[]>(
    existingScores?.holes || []
  );

  const currentHole = course.holes[currentHoleIndex];
  const currentScore = holeScores.find(
    (s) => s.holeNumber === currentHole.number
  );

  const handleScoreChange = (newStrokes: number) => {
    const updatedScores = [...holeScores];
    const existingIndex = updatedScores.findIndex(
      (s) => s.holeNumber === currentHole.number
    );

    const points = calculateStablefordPoints(
      newStrokes,
      currentHole.par,
      handicap,
      currentHole.strokeIndex
    );

    const newHoleScore: HoleScore = {
      holeNumber: currentHole.number,
      strokes: newStrokes,
      points,
    };

    if (existingIndex >= 0) {
      updatedScores[existingIndex] = newHoleScore;
    } else {
      updatedScores.push(newHoleScore);
    }

    setHoleScores(updatedScores);

    // Check for celebration
    if (shouldCelebrate(newStrokes, currentHole.par)) {
      const description = getScoreDescription(newStrokes, currentHole.par);
      Alert.alert(
        `${description}! 🎉`,
        `Great job on hole ${currentHole.number}!`
      );
    }
  };

  const handleSaveScores = () => {
    const totalStrokes = holeScores.reduce((sum, s) => sum + s.strokes, 0);
    const totalPoints = holeScores.reduce((sum, s) => sum + (s.points || 0), 0);

    const scoreData = {
      courseId: course.id,
      dayId: selectedDay,
      holes: holeScores,
      totalStrokes,
      totalPoints,
      timestamp: new Date().toISOString(),
    };

    if (isTeamScoring) {
      const teamScore = { ...scoreData, teamId: scoringId };
      if (existingScores) {
        updateTeamScore(scoringId, selectedDay, teamScore);
      } else {
        addTeamScore(teamScore);
      }
    } else {
      const playerScore = { ...scoreData, playerId: scoringId };
      if (existingScores) {
        updatePlayerScore(scoringId, selectedDay, playerScore);
      } else {
        addPlayerScore(playerScore);
      }
    }

    Alert.alert("Success", "Scores saved successfully!");
  };

  const goToNextHole = () => {
    if (currentHoleIndex < course.holes.length - 1) {
      setCurrentHoleIndex(currentHoleIndex + 1);
    }
  };

  const goToPrevHole = () => {
    if (currentHoleIndex > 0) {
      setCurrentHoleIndex(currentHoleIndex - 1);
    }
  };

  const completedHoles = holeScores.length;
  const totalHoles = course.holes.length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900 mb-1">Scorecard</Text>
        <Text className="text-sm text-gray-600">
          Scoring for: {scoringFor}
        </Text>
        <View className="flex-row items-center mt-2">
          <View className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
            <View
              className="h-2 bg-green-600 rounded-full"
              style={{ width: `${(completedHoles / totalHoles) * 100}%` }}
            />
          </View>
          <Text className="text-xs font-medium text-gray-600">
            {completedHoles}/{totalHoles}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Hole Card */}
        <View className="p-6">
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Hole Header */}
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-5xl font-bold text-gray-900">
                  {currentHole.number}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">Hole</Text>
              </View>
              <View className="items-end">
                <Text className="text-3xl font-bold text-green-600">
                  Par {currentHole.par}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  SI: {currentHole.strokeIndex}
                </Text>
              </View>
            </View>

            {/* Score Input */}
            <View className="items-center py-8">
              <Text className="text-lg font-medium text-gray-700 mb-4">
                Enter Score
              </Text>
              <ScoreInput
                value={currentScore?.strokes || 0}
                onIncrement={() =>
                  handleScoreChange((currentScore?.strokes || 0) + 1)
                }
                onDecrement={() =>
                  handleScoreChange(Math.max(0, (currentScore?.strokes || 0) - 1))
                }
                par={currentHole.par}
              />

              {currentScore && (
                <View className="mt-6 items-center">
                  <Text className="text-sm text-gray-500 mb-1">
                    {getScoreDescription(currentScore.strokes, currentHole.par)}
                  </Text>
                  <Text className="text-lg font-bold text-blue-600">
                    {currentScore.points || 0} Stableford Points
                  </Text>
                </View>
              )}
            </View>

            {/* Navigation */}
            <View className="flex-row justify-between mt-4">
              <Pressable
                onPress={goToPrevHole}
                disabled={currentHoleIndex === 0}
                className={`flex-row items-center px-6 py-3 rounded-lg ${
                  currentHoleIndex === 0 ? "bg-gray-200" : "bg-green-600"
                }`}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={currentHoleIndex === 0 ? "#9ca3af" : "white"}
                />
                <Text
                  className={`ml-2 font-semibold ${
                    currentHoleIndex === 0 ? "text-gray-400" : "text-white"
                  }`}
                >
                  Previous
                </Text>
              </Pressable>

              <Pressable
                onPress={goToNextHole}
                disabled={currentHoleIndex === course.holes.length - 1}
                className={`flex-row items-center px-6 py-3 rounded-lg ${
                  currentHoleIndex === course.holes.length - 1
                    ? "bg-gray-200"
                    : "bg-green-600"
                }`}
              >
                <Text
                  className={`mr-2 font-semibold ${
                    currentHoleIndex === course.holes.length - 1
                      ? "text-gray-400"
                      : "text-white"
                  }`}
                >
                  Next
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={
                    currentHoleIndex === course.holes.length - 1
                      ? "#9ca3af"
                      : "white"
                  }
                />
              </Pressable>
            </View>
          </View>

          {/* Quick View of All Holes */}
          <View className="bg-white rounded-2xl p-6 mt-4 shadow-lg">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Quick View
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {course.holes.map((hole, index) => {
                const score = holeScores.find((s) => s.holeNumber === hole.number);
                const isActive = index === currentHoleIndex;

                return (
                  <Pressable
                    key={hole.number}
                    onPress={() => setCurrentHoleIndex(index)}
                    className={`w-12 h-12 rounded-lg items-center justify-center ${
                      isActive
                        ? "bg-green-600"
                        : score
                        ? "bg-green-100 border border-green-600"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-sm font-bold ${
                        isActive ? "text-white" : score ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {hole.number}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSaveScores}
            className="bg-blue-600 rounded-xl py-4 mt-4 shadow-lg"
          >
            <Text className="text-white text-center font-bold text-lg">
              Save Scores
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
