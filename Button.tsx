import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// CORREÇÃO: Removido '../constants/' pois o arquivo colors está na raiz
import { COLORS } from './colors';

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
  loading?: boolean;
}

export function PremiumButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  loading = false,
}: PremiumButtonProps) {
  const gradientColors =
    variant === 'primary'
      ? ([COLORS.primary, COLORS.primaryDark] as const)
      : variant === 'secondary'
      ? ([COLORS.secondary, '#E55B2B'] as const)
      : (['transparent', 'transparent'] as const);

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        testID="premium-button-outline"
        style={[styles.outline, style, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.outlineText}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      testID="premium-button"
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[style, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  outlineText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
