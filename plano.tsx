import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { getMealPlan } from '../../src/services/api';

const { width } = Dimensions.get('window');

const MEAL_ICONS: Record<string, string> = {
  cafe_da_manha: 'cafe',
  almoco: 'restaurant',
  sobremesa: 'ice-cream',
  lanche: 'nutrition',
  janta: 'moon',
};

const MEAL_LABELS: Record<string, string> = {
  cafe_da_manha: 'Café da Manhã',
  almoco: 'Almoço',
  sobremesa: 'Sobremesa',
  lanche: 'Lanche',
  janta: 'Janta',
};

const MEAL_COLORS: Record<string, string> = {
  cafe_da_manha: '#FF9800',
  almoco: '#4CAF50',
  sobremesa: '#E91E63',
  lanche: '#2196F3',
  janta: '#9C27B0',
};

export default function PlanoScreen() {
  const [mealPlan, setMealPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    getMealPlan().then(data => { setMealPlan(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const currentDay = mealPlan.find((d: any) => d.day === selectedDay);

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  const meals = currentDay ? ['cafe_da_manha', 'almoco', 'sobremesa', 'lanche', 'janta'] : [];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="flame" size={24} color={COLORS.white} />
            <Text style={styles.headerTitle}>Desafio 21 Dias</Text>
          </View>
          <Text style={styles.headerSubtitle}>Elimine 5kg com alimentação saudável</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(selectedDay / 21) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Dia {selectedDay} de 21</Text>
        </LinearGradient>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll} contentContainerStyle={styles.dayScrollContent}>
          {Array.from({ length: 21 }, (_, i) => i + 1).map(day => (
            <TouchableOpacity
              testID={`day-${day}`}
              key={day}
              style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[styles.dayChipText, selectedDay === day && styles.dayChipTextActive]}>{day}</Text>
              <Text style={[styles.dayChipLabel, selectedDay === day && styles.dayChipLabelActive]}>Dia</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mealsContent}>
          {currentDay && (
            <View style={styles.calorieCard}>
              <Ionicons name="flame" size={20} color={COLORS.secondary} />
              <Text style={styles.calorieText}>{currentDay.total_calories} kcal total</Text>
            </View>
          )}

          {meals.map((mealKey) => {
            const meal = currentDay[mealKey];
            if (!meal) return null;
            return (
              <View testID={`meal-${mealKey}`} key={mealKey} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={[styles.mealIconContainer, { backgroundColor: MEAL_COLORS[mealKey] + '20' }]}>
                    <Ionicons name={MEAL_ICONS[mealKey] as any} size={22} color={MEAL_COLORS[mealKey]} />
                  </View>
                  <View style={styles.mealHeaderInfo}>
                    <Text style={styles.mealLabel}>{MEAL_LABELS[mealKey]}</Text>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                  </View>
                  <View style={styles.calorieBadge}>
                    <Text style={styles.calorieBadgeText}>{meal.calories} kcal</Text>
                  </View>
                </View>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealDesc}>{meal.description}</Text>
              </View>
            );
          })}

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  safeArea: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.black },
  header: { padding: 20, paddingBottom: 16 },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  headerTitle: { color: COLORS.white, fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 12 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: COLORS.white, borderRadius: 3 },
  progressText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 6, textAlign: 'right' },
  dayScroll: { maxHeight: 75, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dayScrollContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  dayChip: { width: 48, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surfaceElevated },
  dayChipActive: { backgroundColor: COLORS.primary },
  dayChipText: { color: COLORS.gray, fontSize: 18, fontWeight: '700' },
  dayChipTextActive: { color: COLORS.white },
  dayChipLabel: { color: COLORS.grayLight, fontSize: 10 },
  dayChipLabelActive: { color: 'rgba(255,255,255,0.8)' },
  mealsContent: { padding: 16 },
  calorieCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.surface, padding: 14, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  calorieText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  mealCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  mealHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  mealIconContainer: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mealHeaderInfo: { flex: 1, marginLeft: 12 },
  mealLabel: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  mealTime: { color: COLORS.gray, fontSize: 12 },
  calorieBadge: { backgroundColor: 'rgba(255,107,53,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  calorieBadgeText: { color: COLORS.secondary, fontSize: 12, fontWeight: '700' },
  mealName: { color: COLORS.white, fontSize: 17, fontWeight: '700', marginBottom: 4 },
  mealDesc: { color: COLORS.gray, fontSize: 13, lineHeight: 18 },
});
