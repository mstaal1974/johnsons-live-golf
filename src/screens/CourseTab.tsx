import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useGameStore } from "../state/gameStore";

export const CourseTab: React.FC = () => {
  const tournament = useGameStore((s) => s.tournament);
  const courses = useGameStore((s) => s.courses);
  const selectedDay = useGameStore((s) => s.selectedDay);

  const day = tournament?.days.find((d) => d.id === selectedDay);
  const course = courses.find((c) => c.id === day?.courseId);

  if (!tournament || !selectedDay) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="list-outline" size={64} color="#d1d5db" />
        <Text className="text-gray-500 text-center mt-4 text-base px-6">
          Please select a tournament day
        </Text>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Ionicons name="list-outline" size={64} color="#d1d5db" />
        <Text className="text-gray-500 text-center mt-4 text-base px-6">
          No course configured for this day
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">{course.name}</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Par {course.totalPar} • 18 Holes
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Course Summary */}
          <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Course Details
            </Text>
            <View className="flex-row justify-between py-2 border-b border-gray-200">
              <Text className="text-gray-600">Total Par</Text>
              <Text className="font-semibold text-gray-900">
                {course.totalPar}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-200">
              <Text className="text-gray-600">Number of Holes</Text>
              <Text className="font-semibold text-gray-900">
                {course.holes.length}
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-600">Par 3s</Text>
              <Text className="font-semibold text-gray-900">
                {course.holes.filter((h) => h.par === 3).length}
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-600">Par 4s</Text>
              <Text className="font-semibold text-gray-900">
                {course.holes.filter((h) => h.par === 4).length}
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-600">Par 5s</Text>
              <Text className="font-semibold text-gray-900">
                {course.holes.filter((h) => h.par === 5).length}
              </Text>
            </View>
          </View>

          {/* Hole-by-Hole */}
          <View className="bg-white rounded-xl p-6 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Hole-by-Hole
            </Text>
            
            {/* Front 9 */}
            <Text className="text-base font-semibold text-gray-700 mb-2">
              Front 9
            </Text>
            {course.holes.slice(0, 9).map((hole) => (
              <View
                key={hole.number}
                className="flex-row justify-between items-center py-3 border-b border-gray-100"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                    <Text className="font-bold text-green-700">
                      {hole.number}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-base font-medium text-gray-900">
                      Hole {hole.number}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      SI: {hole.strokeIndex}
                    </Text>
                  </View>
                </View>
                <Text className="text-lg font-bold text-green-600">
                  Par {hole.par}
                </Text>
              </View>
            ))}
            
            {/* Back 9 */}
            <Text className="text-base font-semibold text-gray-700 mb-2 mt-6">
              Back 9
            </Text>
            {course.holes.slice(9, 18).map((hole) => (
              <View
                key={hole.number}
                className="flex-row justify-between items-center py-3 border-b border-gray-100"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                    <Text className="font-bold text-green-700">
                      {hole.number}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-base font-medium text-gray-900">
                      Hole {hole.number}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      SI: {hole.strokeIndex}
                    </Text>
                  </View>
                </View>
                <Text className="text-lg font-bold text-green-600">
                  Par {hole.par}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
