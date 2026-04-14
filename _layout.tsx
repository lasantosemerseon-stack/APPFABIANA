import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from './authStore';
import { COLORS } from './colors';

export default function RootLayout() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    // Verifica se estamos em uma das telas protegidas
    const inAuthGroup = ['Home', 'Receitas', 'Plano'].includes(segments[0]);
    const isLoginPage = segments.length === 0 || segments[0] === 'index';

    if (!isAuthenticated && !isLoginPage && inAuthGroup) {
      router.replace('/');
    } else if (isAuthenticated && isLoginPage) {
      router.replace('/Home'); 
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.black },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="Home" />
        <Stack.Screen name="Receitas" />
        <Stack.Screen name="Plano" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
  },
});
