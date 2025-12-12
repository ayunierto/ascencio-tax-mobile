import React from "react";
import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";

interface SimpleCardContentProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export const CardContent = ({
  style,
  children,
  ...props
}: SimpleCardContentProps): JSX.Element => {
  return (
    <View style={[styles.cardContent, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    padding: 15,
  },
});
