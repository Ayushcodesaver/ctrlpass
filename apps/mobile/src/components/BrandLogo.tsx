import React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Text } from 'tamagui';

type Props = {
  size?: number;
  showWordmark?: boolean;
  tagline?: boolean;
  variant?: 'mark' | 'app';
  style?: StyleProp<ViewStyle>;
};

const COLORS = {
  background: '#050505',
  surface: '#111111',
  border: 'rgba(214,180,122,0.22)',

  champagne: '#D6B47A',
  champagneBright: '#E4C98F',

  text: '#F5F5F2',
  muted: '#A7A39B',
};

function CtrlPassMark({
  size,
  app = false,
}: {
  size: number;
  app?: boolean;
}) {
  const stroke = Math.max(2, size * 0.045);

  return (
    <View
      accessible
      accessibilityLabel="CtrlPass logo"
      style={[
        styles.mark,
        {
          width: size,
          height: size,
          borderRadius: size * 0.27,
          backgroundColor: COLORS.surface,
          borderWidth: Math.max(1, size * 0.012),
          borderColor: COLORS.border,
        },
      ]}
    >
      {/* Outer control frame */}
      <View
        style={[
          styles.frame,
          {
            width: size * 0.62,
            height: size * 0.62,
            borderRadius: size * 0.18,
            borderWidth: stroke,
          },
        ]}
      />

      {/* C */}
      <View
        style={[
          styles.cShape,
          {
            width: size * 0.34,
            height: size * 0.34,
            borderRadius: size * 0.17,
            borderWidth: stroke,
          },
        ]}
      />

      {/* P / forward control bar */}
      <View
        style={[
          styles.controlBar,
          {
            width: size * 0.25,
            height: stroke,
            borderRadius: stroke,
            right: size * 0.15,
          },
        ]}
      />

      <View
        style={[
          styles.controlDot,
          {
            width: size * 0.075,
            height: size * 0.075,
            borderRadius: size * 0.0375,
            right: size * 0.145,
            top: size * 0.35,
          },
        ]}
      />

      {app ? (
        <View
          style={[
            styles.appAccent,
            {
              width: size * 0.10,
              height: size * 0.10,
              borderRadius: size * 0.05,
              bottom: size * 0.13,
              right: size * 0.13,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

export function BrandLogo({
  size = 56,
  showWordmark = true,
  tagline = false,
  variant = 'mark',
  style,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        style,
      ]}
    >
      <CtrlPassMark
        size={size}
        app={variant === 'app'}
      />

      {showWordmark ? (
        <View style={styles.wordmarkContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.wordmark,
              {
                fontSize: Math.max(
                  20,
                  size * 0.47,
                ),
              },
            ]}
          >
            Ctrl
            <Text style={styles.wordmarkAccent}>
              Pass
            </Text>
          </Text>

          {tagline ? (
            <Text
              numberOfLines={1}
              style={[
                styles.tagline,
                {
                  fontSize: Math.max(
                    8,
                    size * 0.13,
                  ),
                },
              ]}
            >
              DISCOVER · BOOK · EXPERIENCE
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  mark: {
    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',
  },

  frame: {
    position: 'absolute',

    borderColor: COLORS.champagne,

    transform: [
      {
        rotate: '45deg',
      },
    ],
  },

  cShape: {
    position: 'absolute',

    borderColor: COLORS.champagneBright,

    borderRightColor: 'transparent',

    transform: [
      {
        rotate: '-35deg',
      },
    ],
  },

  controlBar: {
    position: 'absolute',

    backgroundColor: COLORS.champagneBright,
  },

  controlDot: {
    position: 'absolute',

    backgroundColor: COLORS.champagne,
  },

  appAccent: {
    position: 'absolute',

    backgroundColor: COLORS.champagneBright,
  },

  wordmarkContainer: {
    marginLeft: 12,

    minWidth: 0,
  },

  wordmark: {
    color: COLORS.text,

    fontWeight: '800',

    letterSpacing: -1.1,
  },

  wordmarkAccent: {
    color: COLORS.champagne,
  },

  tagline: {
    marginTop: 3,

    color: COLORS.muted,

    fontWeight: '600',

    letterSpacing: 1.1,
  },
});