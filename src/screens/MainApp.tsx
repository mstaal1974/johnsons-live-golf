import React, { useState } from "react";
import { View, Text, Pressable, Modal, TextInput, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useGameStore } from "../state/gameStore";
import { LeaderboardTab } from "./LeaderboardTab";
import { ScorecardTab } from "./ScorecardTab";
import { TeamsTab } from "./TeamsTab";
import { CourseTab } from "./CourseTab";
import { ProfilesTab } from "./ProfilesTab";
import { ChatTab } from "./ChatTab";
import { AdminTab } from "./AdminTab";
import { FirebaseService } from "../api/firebase";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

const SUPER_ADMIN_USERNAME = "tjohnsons";
const SUPER_ADMIN_PASSWORD = "Menage74!";

export const MainApp: React.FC = () => {
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const currentUser = useGameStore((s) => s.currentUser);
  const isSuperAdmin = useGameStore((s) => s.isSuperAdmin);
  const setSuperAdmin = useGameStore((s) => s.setSuperAdmin);
  const setAuthenticated = useGameStore((s) => s.setAuthenticated);
  const setCurrentUser = useGameStore((s) => s.setCurrentUser);

  const handleAdminAuth = () => {
    if (username === SUPER_ADMIN_USERNAME && password === SUPER_ADMIN_PASSWORD) {
      setSuperAdmin(true);
      setShowAdminAuth(false);
      Alert.alert("Success", "Super Admin access granted");
      setUsername("");
      setPassword("");
    } else {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await FirebaseService.signOut();
          setCurrentUser(null);
          setAuthenticated(false);
          setSuperAdmin(false);
        },
      },
    ]);
  };

  return (
    <>
      {/* Email Verification Banner */}
      {currentUser && !currentUser.emailVerified && (
        <View className="bg-amber-500 px-6 py-3">
          <Text className="text-white text-center font-medium">
            ⚠️ Please verify your email address
          </Text>
        </View>
      )}

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";

            switch (route.name) {
              case "Leaderboard":
                iconName = focused ? "trophy" : "trophy-outline";
                break;
              case "Scorecard":
                iconName = focused ? "clipboard" : "clipboard-outline";
                break;
              case "Teams":
                iconName = focused ? "people" : "people-outline";
                break;
              case "Course":
                iconName = focused ? "list" : "list-outline";
                break;
              case "Profiles":
                iconName = focused ? "person" : "person-outline";
                break;
              case "Chat":
                iconName = focused
                  ? "chatbubbles"
                  : "chatbubbles-outline";
                break;
              case "Admin":
                iconName = focused ? "shield" : "shield-outline";
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#10b981",
          tabBarInactiveTintColor: "#9ca3af",
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        })}
      >
        <Tab.Screen name="Leaderboard" component={LeaderboardTab} />
        <Tab.Screen name="Scorecard" component={ScorecardTab} />
        <Tab.Screen name="Teams" component={TeamsTab} />
        <Tab.Screen name="Course" component={CourseTab} />
        <Tab.Screen name="Profiles" component={ProfilesTab} />
        <Tab.Screen name="Chat" component={ChatTab} />
        {isSuperAdmin && <Tab.Screen name="Admin" component={AdminTab} />}
      </Tab.Navigator>

      {/* Floating Super Admin Button */}
      {!isSuperAdmin && (
        <Pressable
          onPress={() => setShowAdminAuth(true)}
          className="absolute bottom-24 right-6 w-14 h-14 bg-gray-800 rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="lock-closed" size={24} color="white" />
        </Pressable>
      )}

      {/* Sign Out Button */}
      {currentUser && (
        <Pressable
          onPress={handleSignOut}
          className="absolute top-16 right-6 w-10 h-10 bg-red-500 rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="log-out" size={20} color="white" />
        </Pressable>
      )}

      {/* Super Admin Auth Modal */}
      <Modal
        visible={showAdminAuth}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAdminAuth(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          <View className="bg-white border-b border-gray-200 px-6 py-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">
              Super Admin Login
            </Text>
            <Pressable onPress={() => setShowAdminAuth(false)}>
              <Ionicons name="close" size={28} color="#374151" />
            </Pressable>
          </View>

          <View className="p-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Username
            </Text>
            <TextInput
              className="bg-white rounded-lg px-4 py-3 mb-4 text-base border border-gray-300"
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Text className="text-sm font-medium text-gray-700 mb-2">
              Password
            </Text>
            <TextInput
              className="bg-white rounded-lg px-4 py-3 mb-6 text-base border border-gray-300"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable
              onPress={handleAdminAuth}
              className="bg-green-600 rounded-lg py-4"
            >
              <Text className="text-white text-center font-semibold text-base">
                Authenticate
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};
