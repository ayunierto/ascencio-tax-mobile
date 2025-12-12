import {
  Text as NativeText,
  StyleProp,
  TextStyle,
  TextProps,
} from 'react-native';
import React from 'react';
import { theme } from './theme';

interface ThemedTextProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}
const ThemedText = ({ children, style, ...props }: ThemedTextProps) => {
  return (
    <NativeText
      style={[{ color: theme.foreground, fontSize: 14 }, style]}
      {...props}
    >
      {children}
    </NativeText>
  );
};

export { ThemedText };
