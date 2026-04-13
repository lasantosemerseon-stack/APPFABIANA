import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { MODULE_IMAGES } from '../../src/constants/images';
import { getModules } from '../../src/services/api';

export default function ReceitasScreen() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getModules().then(data => { setModules(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const allPdfs = modules.flatMap((m: any) => (m.pdfs || []).map((p: any) => ({ ...p, moduleName: m.title, moduleColor: m.color })));
  const filteredPdfs = selectedModule ? allPdfs.filter(p => p.module_id === selectedModule) : allPdfs;

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Receitas</Text>
          <Text style={styles.headerSubtitle}>{allPdfs.length} PDFs disponíveis</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          <TouchableOpacity
            testID="filter-all"
            style={[styles.filterChip, !selectedModule && styles.filterChipActive]}
            onPress={() => setSelectedModule(null)}
          >
            <Text style={[styles.filterText, !selectedModule && styles.filterTextActive]}>Todos</Text>
          </TouchableOpacity>
          {modules.map((m: any) => (
            <TouchableOpacity
              testID={`filter-${m.id}`}
              key={m.id}
              style={[styles.filterChip, selectedModule === m.id && { backgroundColor: m.color }]}
              onPress={() => setSelectedModule(selectedModule === m.id ? null : m.id)}
            >
              <Text style={[styles.filterText, selectedModule === m.id && styles.filterTextActive]}>{m.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredPdfs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={60} color={COLORS.grayLight} />
              <Text style={styles.emptyText}>Nenhum PDF encontrado neste módulo</Text>
            </View>
          ) : (
            filteredPdfs.map((pdf: any, index: number) => (
              <TouchableOpacity
                testID={`pdf-item-${index}`}
                key={pdf.id || index}
                style={styles.pdfCard}
                onPress={() => Linking.openURL(pdf.url)}
                activeOpacity={0.7}
              >
                <View style={[styles.pdfIcon, { backgroundColor: pdf.moduleColor || COLORS.primary }]}>
                  <Ionicons name="document-text" size={24} color={COLORS.white} />
                </View>
                <View style={styles.pdfInfo}>
                  <Text style={styles.pdfName} numberOfLines={2}>{pdf.name}</Text>
                  <Text style={styles.pdfModule}>{pdf.moduleName}</Text>
                </View>
                <Ionicons name="download-outline" size={22} color={COLORS.primary} />
              </TouchableOpacity>
            ))
          )}
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
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { color: COLORS.white, fontSize: 28, fontWeight: '800' },
  headerSubtitle: { color: COLORS.gray, fontSize: 14, marginTop: 4 },
  filterScroll: { maxHeight: 50, marginBottom: 8 },
  filterContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterChip: { backgroundColor: COLORS.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.gray, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: COLORS.white },
  pdfCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 16, marginBottom: 8, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  pdfIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pdfInfo: { flex: 1, marginLeft: 12 },
  pdfName: { color: COLORS.white, fontSize: 15, fontWeight: '600' },
  pdfModule: { color: COLORS.gray, fontSize: 12, marginTop: 2 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: COLORS.gray, fontSize: 16, marginTop: 16 },
});
