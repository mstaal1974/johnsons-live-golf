import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FirebaseService } from "../api/firebase";
import { useGameStore } from "../state/gameStore";

type TabType = "login" | "signup";

export const AuthScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [loading, setLoading] = useState(false);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Sign up fields
  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupHandicap, setSignupHandicap] = useState("");
  
  const setCurrentUser = useGameStore((s) => s.setCurrentUser);
  const setAuthenticated = useGameStore((s) => s.setAuthenticated);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const player = await FirebaseService.signIn(loginEmail, loginPassword);
      setCurrentUser(player);
      setAuthenticated(true);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!signupFullName || !signupEmail || !signupPassword || !signupHandicap) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const handicap = parseFloat(signupHandicap);
    if (isNaN(handicap)) {
      Alert.alert("Error", "Handicap must be a number");
      return;
    }

    setLoading(true);
    try {
      const player = await FirebaseService.signUp(
        signupEmail,
        signupPassword,
        signupFullName,
        handicap
      );
      setCurrentUser(player);
      setAuthenticated(true);
      Alert.alert(
        "Success",
        "Account created! Please check your email to verify your account."
      );
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-green-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow justify-center px-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center mb-10">
            <Text className="text-4xl font-bold text-green-800 mb-2">
              Johnsons Live
            </Text>
            <Text className="text-lg text-green-600">
              Golf Tournament Scoring
            </Text>
          </View>

          {/* Tabs */}
          <View className="flex-row bg-white rounded-xl p-1 mb-6 shadow-sm">
            <Pressable
              className={`flex-1 py-3 rounded-lg ${
                activeTab === "login" ? "bg-green-600" : "bg-transparent"
              }`}
              onPress={() => setActiveTab("login")}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "login" ? "text-white" : "text-gray-600"
                }`}
              >
                Login
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 py-3 rounded-lg ${
                activeTab === "signup" ? "bg-green-600" : "bg-transparent"
              }`}
              onPress={() => setActiveTab("signup")}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "signup" ? "text-white" : "text-gray-600"
                }`}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          {/* Login Form */}
          {activeTab === "login" && (
            <View className="bg-white rounded-2xl p-6 shadow-md">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base"
                placeholder="Enter your email"
                value={loginEmail}
                onChangeText={setLoginEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 mb-6 text-base"
                placeholder="Enter your password"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
                editable={!loading}
              />

              <Pressable
                className={`rounded-lg py-4 ${
                  loading ? "bg-gray-400" : "bg-green-600"
                }`}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-base">
                    Login
                  </Text>
                )}
              </Pressable>
            </View>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <View className="bg-white rounded-2xl p-6 shadow-md">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base"
                placeholder="Enter your full name"
                value={signupFullName}
                onChangeText={setSignupFullName}
                editable={!loading}
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base"
                placeholder="Enter your email"
                value={signupEmail}
                onChangeText={setSignupEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 mb-4 text-base"
                placeholder="Enter your password"
                value={signupPassword}
                onChangeText={setSignupPassword}
                secureTextEntry
                editable={!loading}
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Handicap
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 mb-6 text-base"
                placeholder="Enter your handicap (e.g. 12.5)"
                value={signupHandicap}
                onChangeText={setSignupHandicap}
                keyboardType="decimal-pad"
                editable={!loading}
              />

              <Pressable
                className={`rounded-lg py-4 ${
                  loading ? "bg-gray-400" : "bg-green-600"
                }`}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-base">
                    Create Account
                  </Text>
                )}
              </Pressable>
            </View>
          )}

          <View className="mt-6 px-4">
            <Text className="text-center text-sm text-gray-500">
              By continuing, you agree to Johnsons Live Terms of Service and
              Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
