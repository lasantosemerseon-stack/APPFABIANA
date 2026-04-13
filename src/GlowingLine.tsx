import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface GlowingLineProps {
  color: string;
  width?: number;
  duration?: number;
}

export function GlowingLine({ color, width = 100, duration = 2000 }: GlowingLineProps) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[styles.line, { backgroundColor: color, width, opacity: anim }]}
    />
  );
}

const styles = StyleSheet.create({
  line: {
    height: 2,
    borderRadius: 1,
  },
});
