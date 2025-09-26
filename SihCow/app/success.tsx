import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';

export default function SuccessScreen() {
  const { animalId } = useLocalSearchParams<{ animalId: string }>();

  const handleAddAnother = () => {
    router.push('/(tabs)');
  };

  const handleViewRegistered = () => {
    router.push('/registered');
  };

  const handleGoToDashboard = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
        </View>

        <ThemedText style={styles.successTitle}>Animal Registered Successfully!</ThemedText>
        
        <ThemedText style={styles.successMessage}>
          The animal has been successfully registered in the Bharat Pashudhan database.
        </ThemedText>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="finger-print" size={20} color="#4CAF50" />
            <ThemedText style={styles.detailText}>Animal ID: {animalId}</ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={20} color="#4CAF50" />
            <ThemedText style={styles.detailText}>
              Registered: {new Date().toLocaleDateString()}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cloud-done" size={20} color="#4CAF50" />
            <ThemedText style={styles.detailText}>Synced to BPA Database</ThemedText>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleAddAnother}>
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add Another Animal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewRegistered}>
            <Ionicons name="list" size={24} color="#4CAF50" />
            <Text style={styles.secondaryButtonText}>View Registered Animals</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tertiaryButton} onPress={handleGoToDashboard}>
            <Ionicons name="home" size={24} color="#666" />
            <Text style={styles.tertiaryButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Thank you for using Bharat Pashudhan!
          </ThemedText>
          <ThemedText style={styles.footerSubtext}>
            Your contribution helps improve livestock management across India.
          </ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 15,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  actionButtons: {
    width: '100%',
    gap: 15,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  tertiaryButton: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  tertiaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
