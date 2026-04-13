import React from 'react';
import { TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WHATSAPP_NUMBER } from '../constants/images';

export function WhatsAppButton() {
  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}`;
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      testID="whatsapp-button"
      style={styles.container}
      onPress={openWhatsApp}
      activeOpacity={0.8}
    >
      <Ionicons name="logo-whatsapp" size={28} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
});
