import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FirebaseService } from "./src/api/firebase";
import { useGameStore } from "./src/state/gameStore";
import { AuthScreen } from "./src/screens/AuthScreen";
import { MainApp } from "./src/screens/MainApp";

export default function App() {
  const [loading, setLoading] = useState(true);
  
  const isAuthenticated = useGameStore((s) => s.isAuthenticated);
  const setCurrentUser = useGameStore((s) => s.setCurrentUser);
  const setAuthenticated = useGameStore((s) => s.setAuthenticated);

  useEffect(() => {
    // Initialize Firebase and check for existing auth
    const initializeApp = async () => {
      try {
        await FirebaseService.initialize();
        
        // Check if user is authenticated
        if (FirebaseService.isAuthenticated()) {
          const userId = FirebaseService.getCurrentUserId();
          if (userId) {
            const player = await FirebaseService.getDatabaseValue<any>(`/players/${userId}`);
            if (player) {
              setCurrentUser(player);
              setAuthenticated(true);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        // Always finish loading, even if there's an error
        setLoading(false);
      }
    };

    // Set a timeout to ensure loading doesn't get stuck
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    initializeApp().finally(() => clearTimeout(timeout));

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f0fdf4" }}>
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {isAuthenticated ? (
          <NavigationContainer>
            <MainApp />
            <StatusBar style="dark" />
          </NavigationContainer>
        ) : (
          <>
            <AuthScreen />
            <StatusBar style="dark" />
          </>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
