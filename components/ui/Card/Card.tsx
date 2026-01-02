import React from 'react';
import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme';

interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export const Card = ({ style, children, ...props }: CardProps) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

interface CardContentProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

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
  card: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 15,
  },
});
