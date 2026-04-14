import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image,
  KeyboardAvoidingView, Platform, ScrollView,
  Animated, Easing, Alert, Dimensions, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
// CORREÇÃO: Imports diretos da raiz
import { COLORS, GRADIENTS } from './colors';
import { LOGO_URL, FOOD_IMAGES } from './images';
import { GlowingLine, PremiumButton } from './index'; // Verifique se você tem um arquivo index.ts na raiz exportando esses componentes
import { login } from './api';
import { useAuthStore } from './authStore';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { login: storeLogin } = useAuthStore();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim()) { Alert.alert('Erro', 'Por favor, insira seu email.'); return; }
    if (!password.trim()) { Alert.alert('Erro', 'Por favor, insira sua senha.'); return; }
    setIsLoading(true);
    try {
      const response = await login(email.trim(), password);
      if (response.success && response.user) {
        await storeLogin(response.user);
        router.replace('/home'); // CORREÇÃO: apontando para home.tsx na raiz
      } else {
        Alert.alert('Erro', response.message || 'Credenciais inválidas.');
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível fazer login. Tente novamente.');
    } finally { setIsLoading(false); }
  };

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });

  return (
    <LinearGradient colors={GRADIENTS.premium} style={styles.container}>
      <Image source={{ uri: FOOD_IMAGES.saladBackground }} style={styles.backgroundImage} blurRadius={4} />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.logoContainer}>
                <Animated.View style={[styles.pulsingCircle, { opacity: glowOpacity, transform: [{ scale: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }]} />
                <View style={styles.staticCircle} />
                <Image source={{ uri: LOGO_URL }} style={styles.logo} resizeMode="contain" />
              </View>
              <View style={styles.brandContainer}>
                <Text style={styles.brandName}>NUTRI DE POBRE</Text>
                <GlowingLine color={COLORS.primaryLight} width={width * 0.6} />
                <Text style={styles.slogan}>Alimentação saudável ao alcance de todos</Text>
              </View>
              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>E-mail</Text>
                  <TextInput testID="login-email-input" style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor={COLORS.gray} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Senha</Text>
                  <TextInput testID="login-password-input" style={styles.input} placeholder="Digite sua senha" placeholderTextColor={COLORS.gray} value={password} onChangeText={setPassword} secureTextEntry />
                </View>
                <Text style={styles.hintText}>Use a senha padrão: receitas321</Text>
                <PremiumButton title={isLoading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} variant="primary" disabled={isLoading} style={styles.loginButton} />
              </View>
              <View style={styles.decorativeLines}>
                <GlowingLine color={COLORS.accent} width={100} duration={3000} />
                <GlowingLine color={COLORS.primaryLight} width={150} duration={2500} />
                <GlowingLine color={COLORS.accent} width={100} duration={3000} />
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { position: 'absolute', width, height, opacity: 0.15 },
  overlay: { position: 'absolute', width, height, backgroundColor: 'rgba(0,0,0,0.6)' },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  content: { alignItems: 'center' },
  logoContainer: { position: 'relative', marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
  pulsingCircle: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: COLORS.primaryLight },
  staticCircle: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: COLORS.primary },
  logo: { width:
