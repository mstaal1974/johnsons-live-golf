import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ScoreInputProps {
  value?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  par?: number;
}

export const ScoreInput: React.FC<ScoreInputProps> = ({
  value,
  onIncrement,
  onDecrement,
  disabled = false,
  par,
}) => {
  // Determine color based on score vs par
  let scoreColor = "text-gray-900";
  if (par !== undefined && value > 0) {
    if (value < par) {
      scoreColor = "text-green-600"; // Under par
    } else if (value > par) {
      scoreColor = "text-red-600"; // Over par
    }
  }

  return (
    <View className="flex-row items-center justify-center space-x-4">
      <Pressable
        onPress={onDecrement}
        disabled={disabled || value == null || value === 0}
        className={`w-12 h-12 rounded-full items-center justify-center ${
          disabled || value == null || value === 0 ? "bg-gray-200" : "bg-red-500"
        }`}
      >
        <Ionicons
          name="remove"
          size={24}
          color={disabled || value === 0 ? "#9ca3af" : "white"}
        />
      </Pressable>

      <View className="w-20 h-20 rounded-2xl bg-gray-100 items-center justify-center border-2 border-gray-300">
        <Text className={`text-4xl font-bold ${scoreColor}`}>
          {value != null ? value : "-"}
        </Text>
      </View>

      <Pressable
        onPress={onIncrement}
        disabled={disabled}
        className={`w-12 h-12 rounded-full items-center justify-center ${
          disabled ? "bg-gray-200" : "bg-green-600"
        }`}
      >
        <Ionicons
          name="add"
          size={24}
          color={disabled ? "#9ca3af" : "white"}
        />
      </Pressable>
    </View>
  );
};
