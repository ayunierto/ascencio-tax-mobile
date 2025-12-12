import React from "react";
import {
  View,
  StyleSheet,
  type ViewProps,
  ViewStyle,
  StyleProp,
} from "react-native";
import { theme } from "./theme";

interface DividerProps extends ViewProps {
  direction?: "horizontal" | "vertical";
  style?: StyleProp<ViewStyle>;
}

export const Divider = ({ style, direction = "horizontal" }: DividerProps) => {
  return (
    <View
      style={[
        direction === "horizontal" ? styles.horizontal : styles.vertical,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: "100%",
    height: 1,

    backgroundColor: theme.mutedForeground,
  },
  vertical: {
    height: "100%",
    width: 1,

    backgroundColor: theme.mutedForeground,
  },
});

export default Divider;
