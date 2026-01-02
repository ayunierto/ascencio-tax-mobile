import React from 'react';
import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

interface CardContentProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * @deprecated Use CardContent from components/ui/Card instead.
 * @param param0
 * @returns
 */
export const CardContent = ({
  style,
  children,
  ...props
}: CardContentProps) => {
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
