import React from 'react';
import {
  Input,
  InputProps,
  Text,
  YStack,
} from 'tamagui';

interface FieldProps extends InputProps {
  label?: string;
  error?: string;
}

const COLORS = {
  surface: '#111111',
  surfaceFocused: '#151515',

  border: '#292824',
  borderFocused: '#D6B47A',
  borderError: '#D96B6B',

  text: '#F5F5F2',
  muted: '#77736C',
  label: '#BDB9B1',

  champagne: '#D6B47A',
  error: '#D96B6B',
};

export function Field({
  label,
  error,
  ...props
}: FieldProps) {
  return (
    <YStack
      width="100%"
      marginBottom={18}
    >
      {label ? (
        <Text
          color={COLORS.label}
          fontSize={13}
          fontWeight="600"
          letterSpacing={0.1}
          marginBottom={8}
        >
          {label}
        </Text>
      ) : null}

      <Input
        width="100%"
        minHeight={52}

        backgroundColor={COLORS.surface}

        borderWidth={1}
        borderColor={
          error
            ? COLORS.borderError
            : COLORS.border
        }

        borderRadius={14}

        paddingHorizontal={16}
        paddingVertical={13}

        color={COLORS.text}

        fontSize={15}
        lineHeight={21}

        placeholderTextColor={COLORS.muted}

        selectionColor={COLORS.champagne}

        autoCapitalize="none"

        {...props}
      />

      {error ? (
        <Text
          color={COLORS.error}
          fontSize={12}
          lineHeight={17}
          fontWeight="500"
          marginTop={7}
          paddingHorizontal={2}
        >
          {error}
        </Text>
      ) : null}
    </YStack>
  );
}