import React from 'react';
import { Pressable, StyleSheet, Platform, ViewStyle } from 'react-native';

interface HeaderButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  hitSlop?:
    | number
    | { top?: number; bottom?: number; left?: number; right?: number };
}

/**
 * Header button optimized for iOS to avoid border rendering issues
 * and improve touch target area.
 */
export function HeaderButton({
  onPress,
  children,
  style,
  hitSlop = 10,
}: HeaderButtonProps) {
  const hitSlopValue =
    typeof hitSlop === 'number'
      ? { top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop }
      : hitSlop;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={hitSlopValue}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
      // Disable all default pressable effects on iOS
      android_ripple={undefined}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    // No background, border, or padding by default
    ...Platform.select({
      ios: {
        // Ensure no default iOS button styling
        backgroundColor: 'transparent',
      },
      android: {
        backgroundColor: 'transparent',
      },
    }),
  },
  pressed: {
    opacity: 0.5,
  },
});
