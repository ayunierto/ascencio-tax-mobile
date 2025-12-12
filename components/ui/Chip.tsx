import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native";
import React from "react";
import { theme } from "./theme";
import { Ionicons } from "@expo/vector-icons";

// === Variantes ===
type ChipVariant = "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
type ChipSize = "default" | "sm" | "lg" | "icon";

interface ChipProps extends TouchableOpacityProps {
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  // TODO: Implement variants and sizes
  variant?: ChipVariant;
  size?: ChipSize;
}

const Chip = ({ text, icon, style, color, ...props }: ChipProps) => {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          backgroundColor: theme.accent,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: theme.radius,
        },
        style,
      ]}
      {...props}
    >
      {icon && <Ionicons color={color || "black"} name={icon} size={22} />}
      <Text style={{ color: color || "black" }}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Chip;
