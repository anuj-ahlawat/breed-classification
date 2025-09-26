import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
  const { user, signOut, updateProfile, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [animals, setAnimals] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState('general');
  const [feedbackSubject, setFeedbackSubject] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || '');
      setEditLocation(user.location || '');
      fetchUserAnimals();
    }
  }, [user]);

  const fetchUserAnimals = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://10.12.102.8:4000'}/animals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnimals(data);
      } else if (response.status === 401) {
        Alert.alert('Session Expired', 'Please sign in again');
        router.replace('/signin');
      }
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const handleSaveProfile = async () => {
    const success = await updateProfile(editName, editPhone, editLocation);
    if (success) {
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } else {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut }
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackSubject.trim() || !feedbackMessage.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsSubmittingFeedback(true);
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Please login to continue');
        return;
      }

      const feedbackData = {
        type: feedbackType,
        subject: feedbackSubject.trim(),
        message: feedbackMessage.trim(),
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.name,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://10.12.102.8:4000'}/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Thank you for your feedback! We will review it and get back to you soon.');
        setShowFeedbackModal(false);
        setFeedbackSubject('');
        setFeedbackMessage('');
        setFeedbackType('general');
      } else {
        if (response.status === 401) {
          Alert.alert('Session Expired', 'Please login again');
          router.replace('/signin');
          return;
        }
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      
      if (error instanceof Error && error.message.includes('Network request failed')) {
        Alert.alert(
          'Network Error', 
          'Unable to submit feedback. Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to submit feedback. Please try again later.');
      }
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleOpenFeedback = () => {
    setShowFeedbackModal(true);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Dashboard</ThemedText>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={40} color="#4CAF50" />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.profileName}>{user.name}</ThemedText>
                <ThemedText style={styles.profileEmail}>{user.email}</ThemedText>
                <ThemedText style={styles.profileStats}>
                  {animals.length} Animals Registered
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                style={styles.editButton}
              >
                <Ionicons name="create-outline" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {/* Profile Details */}
            <View style={styles.profileDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <ThemedText style={styles.detailLabel}>Phone:</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={styles.editInput}
                    value={editPhone}
                    onChangeText={setEditPhone}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <ThemedText style={styles.detailValue}>{user.phone || 'Not provided'}</ThemedText>
                )}
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={20} color="#666" />
                <ThemedText style={styles.detailLabel}>Location:</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={styles.editInput}
                    value={editLocation}
                    onChangeText={setEditLocation}
                    placeholder="Enter location"
                  />
                ) : (
                  <ThemedText style={styles.detailValue}>{user.location || 'Not provided'}</ThemedText>
                )}
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <ThemedText style={styles.detailLabel}>Last Login:</ThemedText>
                <ThemedText style={styles.detailValue}>{formatDate(user.lastLogin)}</ThemedText>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <ThemedText style={styles.detailLabel}>Member Since:</ThemedText>
                <ThemedText style={styles.detailValue}>{formatDate(user.createdAt)}</ThemedText>
              </View>
            </View>

            {isEditing && (
              <View style={styles.editActions}>
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  style={styles.cancelButton}
                >
                  <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  style={styles.saveButton}
                >
                  <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Statistics Section */}
          <View style={styles.statsSection}>
            <ThemedText style={styles.sectionTitle}>Statistics</ThemedText>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="paw" size={30} color="#4CAF50" />
                <ThemedText style={styles.statNumber}>{animals.length}</ThemedText>
                <ThemedText style={styles.statLabel}>Total Animals</ThemedText>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="calendar" size={30} color="#2196F3" />
                <ThemedText style={styles.statNumber}>
                  {animals.filter((animal: any) => {
                    const today = new Date();
                    const animalDate = new Date(animal.createdAt);
                    return animalDate.toDateString() === today.toDateString();
                  }).length}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Today</ThemedText>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="trophy" size={30} color="#FF9800" />
                <ThemedText style={styles.statNumber}>
                  {animals.filter((animal: any) => animal.confidence > 0.8).length}
                </ThemedText>
                <ThemedText style={styles.statLabel}>High Confidence</ThemedText>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsSection}>
            <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/camera')}
              >
                <Ionicons name="camera" size={24} color="#fff" />
                <ThemedText style={styles.actionButtonText}>Add Animal</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/registered')}
              >
                <Ionicons name="list" size={24} color="#fff" />
                <ThemedText style={styles.actionButtonText}>View Animals</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/breeds')}
              >
                <Ionicons name="library" size={24} color="#fff" />
                <ThemedText style={styles.actionButtonText}>Browse Breeds</ThemedText>
              </TouchableOpacity>
            </View>
            
            {/* Feedback Section */}
            <View style={styles.feedbackSection}>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={handleOpenFeedback}
              >
                <Ionicons name="chatbubble-outline" size={24} color="#4CAF50" />
                <ThemedText style={styles.feedbackButtonText}>Send Feedback</ThemedText>
                <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Send Feedback</ThemedText>
              <TouchableOpacity onPress={() => setShowFeedbackModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <ThemedText style={styles.inputLabel}>Feedback Type *</ThemedText>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    feedbackType === 'general' && styles.typeOptionSelected
                  ]}
                  onPress={() => setFeedbackType('general')}
                >
                  <ThemedText style={[
                    styles.typeOptionText,
                    feedbackType === 'general' && styles.typeOptionTextSelected
                  ]}>
                    General
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    feedbackType === 'bug' && styles.typeOptionSelected
                  ]}
                  onPress={() => setFeedbackType('bug')}
                >
                  <ThemedText style={[
                    styles.typeOptionText,
                    feedbackType === 'bug' && styles.typeOptionTextSelected
                  ]}>
                    Bug Report
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    feedbackType === 'feature' && styles.typeOptionSelected
                  ]}
                  onPress={() => setFeedbackType('feature')}
                >
                  <ThemedText style={[
                    styles.typeOptionText,
                    feedbackType === 'feature' && styles.typeOptionTextSelected
                  ]}>
                    Feature Request
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <ThemedText style={styles.inputLabel}>Subject *</ThemedText>
              <TextInput
                style={styles.textInput}
                value={feedbackSubject}
                onChangeText={setFeedbackSubject}
                placeholder="Brief description of your feedback"
                maxLength={100}
              />

              <ThemedText style={styles.inputLabel}>Message *</ThemedText>
              <TextInput
                style={[styles.textInput, styles.messageInput]}
                value={feedbackMessage}
                onChangeText={setFeedbackMessage}
                placeholder="Please provide detailed feedback..."
                multiline
                numberOfLines={6}
                maxLength={1000}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setShowFeedbackModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleSubmitFeedback}
                  disabled={isSubmittingFeedback}
                >
                  {isSubmittingFeedback ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="send" size={20} color="#FFFFFF" />
                      <Text style={styles.submitButtonText}>Send Feedback</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  signOutButton: {
    padding: 8,
  },
  profileSection: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profileStats: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  profileDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    marginRight: 10,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsSection: {
    margin: 15,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionsSection: {
    margin: 15,
    marginTop: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 8,
  },
  feedbackSection: {
    marginTop: 15,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  typeOptionSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeOptionTextSelected: {
    color: '#FFFFFF',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
