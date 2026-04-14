import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TextInput,
  TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl,
  Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFonts, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from '@expo-google-fonts/montserrat';

// --- CORREÇÃO: Imports alterados para a raiz ---
import { COLORS, GRADIENTS } from './colors';
import { LOGO_URL, CHALLENGE_HERO, MODULE_IMAGES } from './images';
import { WhatsAppButton } from './index';
import { getModules } from './api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

// ... (Mantenha as funções GlowingBorder, GlowingNumber e PremiumOrangeButton exatamente como estavam no seu original)

export default function HomeScreen() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black });

  const fetchData = useCallback(async () => {
    try { const data = await getModules(); setModules(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };
  const filteredModules = searchQuery ? modules.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase())) : modules;

  if (loading || !fontsLoaded) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}>
          <View style={styles.searchContainer}><Ionicons name="search" size={20} color={COLORS.gray} /><TextInput testID="search-input" style={styles.searchInput} placeholder="Buscar receitas..." placeholderTextColor={COLORS.gray} value={searchQuery} onChangeText={setSearchQuery} /></View>

          {/* --- CORREÇÃO: Roteamento atualizado --- */}
          <TouchableOpacity testID="featured-banner" style={styles.banner} activeOpacity={0.9} onPress={() => router.push('/module_1')}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1761315600943-d8a5bb0c499f?w=800&q=80' }} style={styles.bannerImage} blurRadius={2} />
            <LinearGradient colors={['transparent', 'rgba(10,10,10,0.8)', COLORS.black]} style={styles.bannerOverlay}>
              <View style={styles.badgeContainer}><View style={styles.badge}><Ionicons name="star" size={14} color={COLORS.white} /><Text style={[styles.badgeText, { fontFamily: 'Montserrat_700Bold' }]}>DESTAQUE</Text></View></View>
              <Text style={[styles.bannerTitle, { fontFamily: 'Montserrat_800ExtraBold' }]}>365 Receitas com Ovo</Text>
              <Text style={styles.bannerDesc}>O guia completo de 365 receitas saudáveis com ovo para o ano inteiro!</Text>
              <PremiumOrangeButton title="Acessar Agora" onPress={() => router.push('/module_1')} icon="arrow-forward" />
            </LinearGradient>
          </TouchableOpacity>

          <GlowingBorder style={styles.challengeCard}>
            <TouchableOpacity testID="challenge-card" activeOpacity={0.9} onPress={() => router.push('/plano')} style={{ flex: 1 }}>
              <Image source={{ uri: CHALLENGE_HERO }} style={styles.challengeImage} blurRadius={3} />
              <LinearGradient colors={['rgba(0,200,150,0.7)', 'rgba(10,10,10,0.9)']} style={styles.challengeOverlay}>
                <View style={styles.challengeContent}>
                  <View style={styles.challengeBadge}><Ionicons name="flame" size={16} color={COLORS.secondary} /><Text style={[styles.challengeBadgeText, { fontFamily: 'Montserrat_800ExtraBold' }]}>DESAFIO</Text></View>
                  <Text style={[styles.challengeTitle, { fontFamily: 'Montserrat_900Black' }]}>21 Dias para{'\n'}Eliminar 5kg</Text>
                  <Text style={styles.challengeDesc}>Plano alimentar completo com 5 refeições diárias</Text>
                  <View style={styles.challengeStats}>
                    <View style={styles.challengeStat}><Text style={[styles.challengeStatNum, { fontFamily: 'Montserrat_800ExtraBold' }]}>21</Text><Text style={styles.challengeStatLabel}>Dias</Text></View>
                    <View style={styles.challengeStat}><Text style={[styles.challengeStatNum, { fontFamily: 'Montserrat_800ExtraBold' }]}>5</Text><Text style={styles.challengeStatLabel}>Refeições</Text></View>
                    <View style={styles.challengeStat}><Text style={[styles.challengeStatNum, { fontFamily: 'Montserrat_800ExtraBold', color: COLORS.secondary }]}>-5kg</Text><Text style={styles.challengeStatLabel}>Meta</Text></View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </GlowingBorder>

          <View style={styles.statsRow}><Text style={[styles.sectionTitle, { fontFamily: 'Montserrat_800ExtraBold' }]}>Todos os Módulos</Text><TouchableOpacity testID="view-all-btn" onPress={() => router.push('/receitas')}><Text style={styles.viewAll}>Ver todos</Text></TouchableOpacity></View>
          {/* ... (resto do código igual) */}
        </ScrollView>
      </SafeAreaView>
      <WhatsAppButton />
    </View>
  );
}
// ... (mantenha os estilos exatamente como estavam)
