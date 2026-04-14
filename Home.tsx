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
import { COLORS, GRADIENTS } from '../../src/constants/colors';
import { LOGO_URL, CHALLENGE_HERO, MODULE_IMAGES } from '../../src/constants/images';
import { WhatsAppButton } from '../../src/components';
import { getModules } from '../../src/services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2;

function GlowingBorder({ children, style }: { children: React.ReactNode; style?: any }) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(glowAnim, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: false })).start();
  }, []);
  const borderColor = glowAnim.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: ['rgba(0,200,150,0.9)', 'rgba(0,230,172,1)', 'rgba(0,180,130,0.7)', 'rgba(0,255,200,1)', 'rgba(0,200,150,0.9)'] });
  const shadowOpacity = glowAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 0.9, 0.4] });
  return (
    <Animated.View style={[style, { borderWidth: 2, borderColor, shadowColor: '#00C896', shadowOffset: { width: 0, height: 0 }, shadowOpacity, shadowRadius: 15, elevation: 10 }]}>
      {children}
    </Animated.View>
  );
}

function GlowingNumber({ value, color }: { value: string; color: string }) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
    ])).start();
  }, []);
  const textShadowRadius = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [4, 18] });
  return (
    <Animated.Text style={[styles.statNumber, { color, textShadowColor: color, textShadowOffset: { width: 0, height: 0 }, textShadowRadius }]}>{value}</Animated.Text>
  );
}

function PremiumOrangeButton({ title, onPress, icon }: { title: string; onPress: () => void; icon?: string }) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
    ])).start();
  }, []);
  const shadowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={{ shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 0 }, shadowOpacity, shadowRadius: 12, elevation: 8 }}>
        <LinearGradient colors={['#FF8A5C', '#FF6B35', '#E55B2B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>{title}</Text>
          {icon && <Ionicons name={icon as any} size={18} color={COLORS.white} />}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

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

          <TouchableOpacity testID="featured-banner" style={styles.banner} activeOpacity={0.9} onPress={() => router.push('/module/module_1')}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1761315600943-d8a5bb0c499f?w=800&q=80' }} style={styles.bannerImage} blurRadius={2} />
            <LinearGradient colors={['transparent', 'rgba(10,10,10,0.8)', COLORS.black]} style={styles.bannerOverlay}>
              <View style={styles.badgeContainer}><View style={styles.badge}><Ionicons name="star" size={14} color={COLORS.white} /><Text style={[styles.badgeText, { fontFamily: 'Montserrat_700Bold' }]}>DESTAQUE</Text></View></View>
              <Text style={[styles.bannerTitle, { fontFamily: 'Montserrat_800ExtraBold' }]}>365 Receitas com Ovo</Text>
              <Text style={styles.bannerDesc}>O guia completo de 365 receitas saudáveis com ovo para o ano inteiro!</Text>
              <PremiumOrangeButton title="Acessar Agora" onPress={() => router.push('/module/module_1')} icon="arrow-forward" />
            </LinearGradient>
          </TouchableOpacity>

          <GlowingBorder style={styles.challengeCard}>
            <TouchableOpacity testID="challenge-card" activeOpacity={0.9} onPress={() => router.push('/(tabs)/plano')} style={{ flex: 1 }}>
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

          <View style={styles.statsRow}><Text style={[styles.sectionTitle, { fontFamily: 'Montserrat_800ExtraBold' }]}>Todos os Módulos</Text><TouchableOpacity testID="view-all-btn" onPress={() => router.push('/(tabs)/receitas')}><Text style={styles.viewAll}>Ver todos</Text></TouchableOpacity></View>
          <View style={styles.statsCards}>
            <View style={styles.statCard}><GlowingNumber value="10" color={COLORS.primary} /><Text style={[styles.statLabel, { fontFamily: 'Montserrat_700Bold' }]}>Módulos</Text></View>
            <View style={styles.statCard}><Ionicons name="document-text" size={32} color={COLORS.secondary} /><Text style={[styles.statLabel, { fontFamily: 'Montserrat_700Bold', marginTop: 6 }]}>PDFs</Text></View>
          </View>

          <View style={styles.modulesGrid}>
            {filteredModules.map((module: any) => {
              const coverImage = module.image || MODULE_IMAGES[module.id];
              return (
                <TouchableOpacity testID={`module-card-${module.id}`} key={module.id} style={styles.moduleCard} activeOpacity={0.85} onPress={() => router.push(`/module/${module.id}`)}>
                  {coverImage ? <Image source={{ uri: coverImage }} style={styles.moduleImage} /> : <LinearGradient colors={[module.color, COLORS.black]} style={styles.moduleImage}><Ionicons name={module.icon as any} size={40} color={COLORS.white} /></LinearGradient>}
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.moduleOverlay}>
                    <View style={styles.moduleNumberBadge}><Text style={[styles.moduleNumberText, { fontFamily: 'Montserrat_700Bold' }]}>Módulo {module.number}</Text></View>
                    <Text style={[styles.moduleTitle, { fontFamily: 'Montserrat_800ExtraBold' }]} numberOfLines={2}>{module.title}</Text>
                    <View style={styles.modulePdfCount}><Ionicons name="document-text" size={12} color={COLORS.gray} /><Text style={styles.modulePdfText}>{module.pdfs?.length || 0} PDFs</Text></View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
      <WhatsAppButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  safeArea: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.black },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceElevated, borderRadius: 16, margin: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, color: COLORS.white, fontSize: 16, marginLeft: 12 },
  banner: { marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', height: 220, marginBottom: 16 },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  bannerOverlay: { flex: 1, justifyContent: 'flex-end', padding: 16 },
  badgeContainer: { position: 'absolute', top: 16, left: 16 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  badgeText: { color: COLORS.white, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  bannerTitle: { color: COLORS.white, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  bannerDesc: { color: COLORS.gray, fontSize: 13, marginBottom: 12 },
  premiumButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 50, gap: 8 },
  premiumButtonText: { color: COLORS.white, fontSize: 15, fontWeight: '700', fontFamily: 'Montserrat_700Bold' },
  challengeCard: { marginHorizontal: 16, borderRadius: 20, overflow: 'hidden', height: 210, marginBottom: 16 },
  challengeImage: { width: '100%', height: '100%', position: 'absolute' },
  challengeOverlay: { flex: 1, padding: 20 },
  challengeContent: { flex: 1, justifyContent: 'center' },
  challengeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  challengeBadgeText: { color: COLORS.secondary, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  challengeTitle: { color: COLORS.white, fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 6 },
  challengeDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 },
  challengeStats: { flexDirection: 'row', gap: 24 },
  challengeStat: { alignItems: 'center' },
  challengeStatNum: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  challengeStatLabel: { color: COLORS.gray, fontSize: 10, textTransform: 'uppercase' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  viewAll: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  statsCards: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, minHeight: 80 },
  statNumber: { fontSize: 28, fontWeight: '800', fontFamily: 'Montserrat_900Black' },
  statLabel: { color: COLORS.gray, fontSize: 13, marginTop: 4 },
  modulesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  moduleCard: { width: CARD_WIDTH, height: CARD_WIDTH * 1.25, borderRadius: 16, overflow: 'hidden', backgroundColor: COLORS.surface },
  moduleImage: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  moduleOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, paddingTop: 40 },
  moduleNumberBadge: { backgroundColor: 'rgba(0,200,150,0.3)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 4 },
  moduleNumberText: { color: COLORS.primary, fontSize: 10, fontWeight: '700' },
  moduleTitle: { color: COLORS.white, fontSize: 14, fontWeight: '700', lineHeight: 18 },
  modulePdfCount: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  modulePdfText: { color: COLORS.gray, fontSize: 11 },
});
