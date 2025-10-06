import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGameStore } from "../state/gameStore";
import { Avatar } from "../components/Avatar";
import { calculateTeamHandicap, generateAvatarColor } from "../utils/golfUtils";
import { Team } from "../types/golf";

export const TeamsTab: React.FC = () => {
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [teamName, setTeamName] = useState("");

  const tournament = useGameStore((s) => s.tournament);
  const players = useGameStore((s) => s.players);
  const teams = useGameStore((s) => s.teams);
  const addTeam = useGameStore((s) => s.addTeam);
  const updateTeam = useGameStore((s) => s.updateTeam);
  const deleteTeam = useGameStore((s) => s.deleteTeam);
  const isSuperAdmin = useGameStore((s) => s.isSuperAdmin);

  if (!tournament || tournament.gameMode !== "Ambrose") {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="people-outline" size={64} color="#d1d5db" />
        <Text className="text-gray-500 text-center mt-4 text-base px-6">
          Teams are only available in Ambrose mode
        </Text>
        <Text className="text-gray-400 text-center mt-2 text-sm px-6">
          Change game mode in Admin tab
        </Text>
      </SafeAreaView>
    );
  }

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      Alert.alert("Error", "Please enter a team name");
      return;
    }

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: teamName.trim(),
      playerIds: [],
      teamHandicap: 0,
      color: generateAvatarColor(),
    };

    addTeam(newTeam);
    setTeamName("");
    setShowAddTeam(false);
    Alert.alert("Success", "Team created!");
  };

  const togglePlayerInTeam = (teamId: string, playerId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    const isInTeam = team.playerIds.includes(playerId);
    let newPlayerIds: string[];

    if (isInTeam) {
      newPlayerIds = team.playerIds.filter((id) => id !== playerId);
    } else {
      // Remove player from other teams
      teams.forEach((t) => {
        if (t.id !== teamId && t.playerIds.includes(playerId)) {
          const filtered = t.playerIds.filter((id) => id !== playerId);
          const handicaps = filtered.map(
            (id) => players.find((p) => p.uid === id)?.handicap || 0
          );
          updateTeam(t.id, {
            playerIds: filtered,
            teamHandicap: calculateTeamHandicap(handicaps),
          });
        }
      });

      newPlayerIds = [...team.playerIds, playerId];
    }

    const handicaps = newPlayerIds.map(
      (id) => players.find((p) => p.uid === id)?.handicap || 0
    );

    updateTeam(teamId, {
      playerIds: newPlayerIds,
      teamHandicap: calculateTeamHandicap(handicaps),
    });
  };

  const handleDeleteTeam = (teamId: string) => {
    Alert.alert("Delete Team", "Are you sure you want to delete this team?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteTeam(teamId),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Teams</Text>
        <Text className="text-sm text-gray-600">
          Ambrose Mode - {teams.length} teams
        </Text>
      </View>

      {isSuperAdmin && (
        <View className="bg-white border-b border-gray-200 px-6 py-3">
          {!showAddTeam ? (
            <Pressable
              onPress={() => setShowAddTeam(true)}
              className="bg-green-600 rounded-lg py-3 flex-row items-center justify-center"
            >
              <Ionicons name="add" size={24} color="white" />
              <Text className="text-white font-semibold ml-2">Add Team</Text>
            </Pressable>
          ) : (
            <View>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 mb-2 text-base"
                placeholder="Team name"
                value={teamName}
                onChangeText={setTeamName}
              />
              <View className="flex-row gap-2">
                <Pressable
                  onPress={handleCreateTeam}
                  className="flex-1 bg-green-600 rounded-lg py-3"
                >
                  <Text className="text-white font-semibold text-center">
                    Create
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowAddTeam(false)}
                  className="flex-1 bg-gray-300 rounded-lg py-3"
                >
                  <Text className="text-gray-700 font-semibold text-center">
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}

      <ScrollView className="flex-1">
        {teams.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="people-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-center mt-4 text-base">
              No teams created yet
            </Text>
          </View>
        ) : (
          <View className="p-4">
            {teams.map((team) => {
              const teamPlayers = players.filter((p) =>
                team.playerIds.includes(p.uid)
              );

              return (
                <View
                  key={team.id}
                  className="bg-white rounded-xl p-6 mb-4 shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center flex-1">
                      <Avatar
                        name={team.name}
                        size="lg"
                        color={team.color}
                      />
                      <View className="ml-4 flex-1">
                        <Text className="text-xl font-bold text-gray-900">
                          {team.name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          Team Handicap: {team.teamHandicap.toFixed(1)}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {teamPlayers.length} {teamPlayers.length === 1 ? "player" : "players"}
                        </Text>
                      </View>
                    </View>
                    {isSuperAdmin && (
                      <Pressable onPress={() => handleDeleteTeam(team.id)}>
                        <Ionicons name="trash-outline" size={24} color="#ef4444" />
                      </Pressable>
                    )}
                  </View>

                  {/* Team Members */}
                  {teamPlayers.length > 0 && (
                    <View className="border-t border-gray-200 pt-4 mt-2">
                      {teamPlayers.map((player) => (
                        <View
                          key={player.uid}
                          className="flex-row items-center py-2"
                        >
                          <Avatar name={player.fullName} size="sm" />
                          <View className="ml-3 flex-1">
                            <Text className="text-base font-medium text-gray-900">
                              {player.fullName}
                            </Text>
                            <Text className="text-sm text-gray-500">
                              Handicap: {player.handicap}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Add Players (Admin Only) */}
                  {isSuperAdmin && (
                    <View className="border-t border-gray-200 pt-4 mt-4">
                      <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Add Players
                      </Text>
                      {players.map((player) => {
                        const isInTeam = team.playerIds.includes(player.uid);
                        return (
                          <Pressable
                            key={player.uid}
                            onPress={() =>
                              togglePlayerInTeam(team.id, player.uid)
                            }
                            className={`flex-row items-center justify-between py-2 px-3 rounded-lg mb-2 ${
                              isInTeam ? "bg-green-100" : "bg-gray-50"
                            }`}
                          >
                            <View className="flex-row items-center flex-1">
                              <Avatar name={player.fullName} size="sm" />
                              <Text className="ml-3 text-base text-gray-900">
                                {player.fullName}
                              </Text>
                            </View>
                            <Ionicons
                              name={
                                isInTeam
                                  ? "checkmark-circle"
                                  : "ellipse-outline"
                              }
                              size={24}
                              color={isInTeam ? "#10b981" : "#9ca3af"}
                            />
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
