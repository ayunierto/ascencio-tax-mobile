import React from "react";
import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { theme } from "../theme";

interface SimpleCardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export const Card = ({
  style,
  children,
  ...props
}: SimpleCardProps): JSX.Element => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    overflow: "hidden",
  },
});
