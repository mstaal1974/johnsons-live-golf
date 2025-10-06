import React from "react";
import { View, Text } from "react-native";
import { getInitials } from "../utils/golfUtils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = "md",
  color = "#10b981",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <View
      className={`${sizeClasses[size]} rounded-full items-center justify-center`}
      style={{ backgroundColor: color }}
    >
      <Text className={`${textSizeClasses[size]} font-bold text-white`}>
        {getInitials(name)}
      </Text>
    </View>
  );
};
