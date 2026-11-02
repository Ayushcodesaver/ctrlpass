import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Spinner } from 'tamagui';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

type Variant = NonNullable<ButtonProps['variant']>;
type Size = NonNullable<ButtonProps['size']>;

const COLORS = {
  background: '#050505',
  surface: '#111111',
  surfacePressed: '#191918',

  champagne: '#D6B47A',
  champagnePressed: '#C4A269',

  text: '#F5F5F2',
  textSecondary: '#AAA69E',
  darkText: '#17130D',

  border: '#292824',
  borderPressed: '#3A3832',

  danger: '#D96B6B',
  dangerPressed: '#C55E5E',

  white: '#FFFFFF',
};

const VARIANTS: Record<
  Variant,
  {
    backgroundColor: string;
    pressedBackgroundColor: string;
    borderColor: string;
    pressedBorderColor: string;
    textColor: string;
  }
> = {
  primary: {
    backgroundColor: COLORS.champagne,
    pressedBackgroundColor: COLORS.champagnePressed,
    borderColor: COLORS.champagne,
    pressedBorderColor: COLORS.champagnePressed,
    textColor: COLORS.darkText,
  },

  secondary: {
    backgroundColor: COLORS.surface,
    pressedBackgroundColor: COLORS.surfacePressed,
    borderColor: COLORS.border,
    pressedBorderColor: COLORS.borderPressed,
    textColor: COLORS.text,
  },

  ghost: {
    backgroundColor: 'transparent',
    pressedBackgroundColor: 'rgba(214,180,122,0.08)',
    borderColor: 'transparent',
    pressedBorderColor: 'rgba(214,180,122,0.16)',
    textColor: COLORS.champagne,
  },

  danger: {
    backgroundColor: 'rgba(217,107,107,0.08)',
    pressedBackgroundColor: 'rgba(217,107,107,0.14)',
    borderColor: 'rgba(217,107,107,0.24)',
    pressedBorderColor: 'rgba(217,107,107,0.38)',
    textColor: COLORS.danger,
  },
};

const SIZES: Record<
  Size,
  {
    height: number;
    horizontalPadding: number;
    fontSize: number;
    radius: number;
  }
> = {
  sm: {
    height: 40,
    horizontalPadding: 15,
    fontSize: 12,
    radius: 12,
  },

  md: {
    height: 50,
    horizontalPadding: 20,
    fontSize: 14,
    radius: 15,
  },

  lg: {
    height: 54,
    horizontalPadding: 22,
    fontSize: 15,
    radius: 16,
  },
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  size = 'md',
  disabled = false,
  onPress,
  style,
}: ButtonProps) {
  const inactive = disabled || loading;

  const variantStyle = VARIANTS[variant];
  const sizeStyle = SIZES[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: inactive,
        busy: loading,
      }}
      disabled={inactive}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.base,

        {
          height: sizeStyle.height,
          paddingHorizontal: sizeStyle.horizontalPadding,
          borderRadius: sizeStyle.radius,

          backgroundColor: pressed
            ? variantStyle.pressedBackgroundColor
            : variantStyle.backgroundColor,

          borderColor: pressed
            ? variantStyle.pressedBorderColor
            : variantStyle.borderColor,
        },

        inactive && styles.disabled,

        pressed &&
          !inactive &&
          styles.pressed,

        style,
      ]}
    >
      {loading ? (
        <View style={styles.loadingContent}>
          <Spinner
            size="small"
            color={
              variant === 'primary'
                ? variantStyle.textColor
                : variantStyle.textColor
            }
          />

          <Text
            style={[
              styles.label,
              {
                color: variantStyle.textColor,
                fontSize: sizeStyle.fontSize,
                marginLeft: 9,
              },
            ]}
          >
            Please wait
          </Text>
        </View>
      ) : (
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            {
              color: variantStyle.textColor,
              fontSize: sizeStyle.fontSize,
            },
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,

    flexDirection: 'row',

    // Android
    elevation: 0,

    // iOS
    shadowOpacity: 0,

    overflow: 'hidden',
  },

  label: {
    fontWeight: '700',
    letterSpacing: -0.15,
    textAlign: 'center',
  },

  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pressed: {
    transform: [{ scale: 0.985 }],
  },

  disabled: {
    opacity: 0.42,
  },
});