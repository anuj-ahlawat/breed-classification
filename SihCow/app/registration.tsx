import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../constants/theme';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegistrationScreen() {
  const { imageUri, breed, animalType, confidence } = useLocalSearchParams<{
    imageUri: string;
    breed: string;
    animalType: string;
    confidence: string;
  }>();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    breed: breed || '',
    animalType: animalType || 'Cattle',
    age: '',
    gender: '',
    tagId: '',
    location: '',
    ownerName: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveToBPA = async () => {
    // Validate required fields
    if (!formData.age || !formData.gender || !formData.tagId) {
      Alert.alert('Missing Information', 'Please fill in all required fields (Age, Gender, Tag ID)');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        imageUri,
        confidence: Number(confidence || '0'),
        registrationDate: new Date().toISOString(),
      };

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please sign in to register animals');
        router.replace('/signin');
        return;
      }

      const resp = await fetch(`${API_BASE_URL}/animals`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || 'Request failed');
      }

      const created = await resp.json();
      router.push({ pathname: '/success', params: { animalId: created._id } });
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to save animal data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Registration',
      'Are you sure you want to cancel? All entered data will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Animal Registration</ThemedText>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imagePreview}>
          <Image source={{ uri: imageUri }} style={styles.animalImage} />
          <View style={styles.imageInfo}>
            <ThemedText style={styles.imageInfoText}>AI Confidence: {confidence}%</ThemedText>
          </View>
        </View>

        <View style={styles.formContainer}>
          <ThemedText style={styles.formTitle}>Animal Details</ThemedText>
          
          {/* Breed (Auto-filled, editable) */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Breed *</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={formData.breed}
                onChangeText={(value) => handleInputChange('breed', value)}
                placeholder="Enter breed name"
                editable={true}
              />
              <Ionicons name="pencil" size={20} color="#666" />
            </View>
          </View>

          {/* Animal Type */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Animal Type *</ThemedText>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, formData.animalType === 'Cattle' && styles.radioButtonSelected]}
                onPress={() => handleInputChange('animalType', 'Cattle')}
              >
                <View style={[styles.radioCircle, formData.animalType === 'Cattle' && styles.radioCircleSelected]} />
                <ThemedText style={styles.radioText}>Cattle</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, formData.animalType === 'Buffalo' && styles.radioButtonSelected]}
                onPress={() => handleInputChange('animalType', 'Buffalo')}
              >
                <View style={[styles.radioCircle, formData.animalType === 'Buffalo' && styles.radioCircleSelected]} />
                <ThemedText style={styles.radioText}>Buffalo</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Age */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Age (in years) *</ThemedText>
            <TextInput
              style={styles.textInput}
              value={formData.age}
              onChangeText={(value) => handleInputChange('age', value)}
              placeholder="e.g., 3"
              keyboardType="numeric"
            />
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Gender *</ThemedText>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, formData.gender === 'Male' && styles.radioButtonSelected]}
                onPress={() => handleInputChange('gender', 'Male')}
              >
                <View style={[styles.radioCircle, formData.gender === 'Male' && styles.radioCircleSelected]} />
                <ThemedText style={styles.radioText}>Male</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, formData.gender === 'Female' && styles.radioButtonSelected]}
                onPress={() => handleInputChange('gender', 'Female')}
              >
                <View style={[styles.radioCircle, formData.gender === 'Female' && styles.radioCircleSelected]} />
                <ThemedText style={styles.radioText}>Female</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tag ID */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Tag ID *</ThemedText>
            <TextInput
              style={styles.textInput}
              value={formData.tagId}
              onChangeText={(value) => handleInputChange('tagId', value)}
              placeholder="e.g., TAG001234"
            />
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Location</ThemedText>
            <TextInput
              style={styles.textInput}
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Village, District, State"
            />
          </View>

          {/* Owner Name */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Owner Name</ThemedText>
            <TextInput
              style={styles.textInput}
              value={formData.ownerName}
              onChangeText={(value) => handleInputChange('ownerName', value)}
              placeholder="Name of the animal owner"
            />
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Additional Notes</ThemedText>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Any additional information about the animal"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Ionicons name="close" size={20} color="#F44336" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]} 
            onPress={handleSaveToBPA}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Ionicons name="hourglass" size={20} color="#FFFFFF" />
            ) : (
              <Ionicons name="save" size={20} color="#FFFFFF" />
            )}
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Saving...' : 'Save to BPA'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2E7D32',
  },
  headerButton: {
    padding: 8,
    minWidth: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  imagePreview: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  animalImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imageInfo: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#E8F5E8',
    borderRadius: 15,
  },
  imageInfoText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioButtonSelected: {
    // Add any selected state styling if needed
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F44336',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
  },
  saveButtonDisabled: {
    backgroundColor: '#999999',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
