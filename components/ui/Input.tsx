import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    View,
    type NativeSyntheticEvent,
    type StyleProp,
    type TextInputFocusEventData,
    type TextInputProps,
    type TextStyle,
    type ViewStyle,
} from "react-native";
import { theme } from "./theme";

interface InputProps extends TextInputProps {
  label?: string;
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  rootStyle?: StyleProp<ViewStyle>; // Style for the outermost container
  containerStyle?: StyleProp<ViewStyle>; // Style for the bordered container
  inputStyle?: StyleProp<TextStyle>; // Style for the actual <TextInput>
  labelStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
  focusedBorderColor?: string;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  value = "",
  placeholder,
  leadingIcon,
  trailingIcon,
  error,
  errorMessage,
  helperText,
  rootStyle,
  containerStyle,
  inputStyle,
  labelStyle,
  errorTextStyle,
  focusedBorderColor = theme.primary,
  onFocus,
  onBlur,
  readOnly,
  ...props
}, forwardedRef) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const internalRef = useRef<TextInput>(null);
  
  // Merge refs: use forwarded ref if provided, otherwise use internal ref
  const textInputRef = forwardedRef || internalRef;

  // We use UseRef for the animated value so that it does not restart in each render.
  const animatedValue = useRef(new Animated.Value(0)).current;

  const [isPasswordVisible, setIsPasswordVisible] = useState(props.secureTextEntry || false);

  const hasValue = value && value.length > 0;
  const shouldFloat = isFocused || hasValue;

  // --- Animation Logic ---
  useEffect(() => {
    // We use UseRef for the animated value so that it does not restart in each render.
    Animated.timing(animatedValue, {
      toValue: shouldFloat ? 1 : 0,
      duration: 200, // Duration of the animation
      useNativeDriver: true,
    }).start();
  }, [shouldFloat, animatedValue]);

  // --- Handlers ---
  const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    setIsFocused(true);
    onFocus?.(event); // Call the original onFocus if it exists.
  };

  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    setIsFocused(false);
    onBlur?.(event); // Call the original onBlur if it exists.
  };

  // --- Dynamic Styles using useMemo for performance ---

  // We memorize the styles of the container to avoid recalculating them on each render.
  const computedContainerStyle = useMemo<StyleProp<ViewStyle>>(() => {
    const borderColor = readOnly
      ? theme.mutedForeground
      : error
        ? theme.destructive
        : isFocused
          ? focusedBorderColor
          : theme.border;

    const borderWidth = error ? 2 : 1;

    return [styles.containerBase, { borderColor, borderWidth }, containerStyle];
  }, [isFocused, error, readOnly, focusedBorderColor, containerStyle]);

  const animatedLabelStyles = useMemo(() => {
    // The label moves up and becomes smaller.
    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -26], // Moves the label 26px up.
    });

    // The label scales to 85% of its original size.
    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.85],
    });

    // The label color changes based on focus and error state.
    const color = error
      ? theme.destructive
      : animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [theme.muted, focusedBorderColor],
        });

    return [
      styles.labelBase,
      labelStyle,
      { color },
      // It is crucial that the `transform` is at the end for the animation to work.
      { transform: [{ translateY }, { scale }] },
    ];
  }, [animatedValue, labelStyle, error, focusedBorderColor]);

  // We memorize the styles of TextInput.
  const computedInputStyle = useMemo<StyleProp<TextStyle>>(() => {
    return [styles.inputBase, { color: readOnly ? theme.mutedForeground : theme.primaryForeground }, inputStyle];
  }, [readOnly, inputStyle]);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={[styles.root, rootStyle]}>
      <View style={computedContainerStyle}>
        <View style={styles.inputWrapper}>
          {leadingIcon && (
            <Ionicons
              name={leadingIcon}
              size={24}
              color={theme.primaryForeground}
              style={[styles.icon, error ? [styles.errorText, errorTextStyle] : null]}
            />
          )}

          <View style={styles.inputArea}>
            {label && (
              <Animated.Text style={animatedLabelStyles} onPress={() => {
                if (typeof textInputRef === 'object' && textInputRef?.current) {
                  textInputRef.current.focus();
                } else if (typeof textInputRef === 'function') {
                  // Handle callback ref
                }
              }}>
                {label}
              </Animated.Text>
            )}

            <TextInput
              ref={textInputRef as any}
              style={computedInputStyle}
              value={value}
              onFocus={handleFocus as any}
              onBlur={handleBlur as any}
              readOnly={readOnly}
              placeholder={!label ? placeholder : ""}
              placeholderTextColor={theme.muted}
              underlineColorAndroid="transparent"
              {...props}
              secureTextEntry={isPasswordVisible}
            />
          </View>

          {trailingIcon && (
            <Ionicons name={trailingIcon} size={24} color={theme.primaryForeground} style={styles.icon} />
          )}

          {props.secureTextEntry && (
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color={theme.primaryForeground}
              style={styles.icon}
              onPress={handleTogglePasswordVisibility}
            />
          )}
        </View>
      </View>

      {/* Show helper text or error message */}
      {(helperText || errorMessage) && (
        <Text style={[styles.helperTextBase, error ? [styles.errorText, errorTextStyle] : null]}>
          {error ? errorMessage : helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

const styles = StyleSheet.create({
  root: {
    width: "100%",
    // marginBottom: 16,
  },
  containerBase: {
    borderRadius: theme.radius,
    height: 54,
    paddingHorizontal: 14,
    backgroundColor: theme.background,
    borderWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputArea: {
    flex: 1,
    justifyContent: "center",
  },
  labelBase: {
    position: "absolute",
    left: 0,
    backgroundColor: theme.background,
    paddingHorizontal: 6,
    fontSize: 14,
    fontWeight: '500',
    borderRadius: theme.radius,
  },
  inputBase: {
    height: "100%",
    fontSize: 16,
    paddingVertical: 0,
  },
  icon: {},
  helperTextBase: {
    marginTop: 6,
    fontSize: 13,
    paddingLeft: 4,
    color: theme.mutedForeground,
  },
  errorText: {
    color: theme.destructive,
  },
});
