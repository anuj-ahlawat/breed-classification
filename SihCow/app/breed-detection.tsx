import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ScrollView, Modal, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BreedPrediction {
  breed: string;
  confidence: number;
  rank: number;
}

interface HeatmapData {
  breed1: string;
  breed2: string;
  heatmap1Uri: string;
  heatmap2Uri: string;
}

interface AIPredictionResult {
  predictions: BreedPrediction[];
  heatmapData: HeatmapData;
  processingTime: number;
}

const API_BASE_URL = 'http://10.12.102.8:4000';

export default function BreedDetectionScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const [prediction, setPrediction] = useState<AIPredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showBreedSelector, setShowBreedSelector] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [showHeatmaps, setShowHeatmaps] = useState(false);

  const allBreeds = [
    'Gir (Cattle)', 'Sahiwal (Cattle)', 'Red Sindhi (Cattle)', 'Tharparkar (Cattle)',
    'Kankrej (Cattle)', 'Ongole (Cattle)', 'Hariana (Cattle)', 'Murrah (Buffalo)',
    'Jaffarabadi (Buffalo)', 'Surti (Buffalo)', 'Mehsana (Buffalo)', 'Nili-Ravi (Buffalo)'
  ];

  useEffect(() => {
    analyzeImage();
  }, []);

  const analyzeImage = async () => {
    try {
      setIsAnalyzing(true);
      
      // Get auth token
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Please login to continue');
        router.push('/signin');
        return;
      }

      // Convert image URI to blob for upload
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);

      const apiResponse = await fetch(`${API_BASE_URL}/breed-detection/detect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!apiResponse.ok) {
        if (apiResponse.status === 401) {
          // Token expired, redirect to login
          Alert.alert('Session Expired', 'Please login again');
          router.push('/signin');
          return;
        }
        throw new Error('Failed to analyze image');
      }

      const result = await apiResponse.json();
      
      if (result.success) {
        setPrediction(result.data);
        setSelectedBreed(result.data.predictions[0]?.breed || '');
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Check if it's a network error
      if (error instanceof Error && error.message.includes('Network request failed')) {
        Alert.alert(
          'Network Error', 
          'Unable to connect to the server. Using offline mode with sample data.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to analyze image. Using mock data.');
      }
      
      // Fallback to mock data
      setPrediction({
        predictions: [
          { breed: 'Gir (Cattle)', confidence: 92, rank: 1 },
          { breed: 'Sahiwal (Cattle)', confidence: 5, rank: 2 },
          { breed: 'Red Sindhi (Cattle)', confidence: 3, rank: 3 }
        ],
        heatmapData: {
          breed1: 'Gir (Cattle)',
          breed2: 'Sahiwal (Cattle)',
          heatmap1Uri: 'data:image/png;base64,mock_heatmap_1',
          heatmap2Uri: 'data:image/png;base64,mock_heatmap_2'
        },
        processingTime: 1.5
      });
      setSelectedBreed('Gir (Cattle)');
    } finally {
      setIsAnalyzing(false);
    }
  };


  const handleConfirmBreed = () => {
    handleRegisterToBPA();
  };

  const handleRegisterToBPA = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Please login to continue');
        return;
      }

      const animalData = {
        breed: selectedBreed,
        animalType: selectedBreed.includes('Buffalo') ? 'Buffalo' : 'Cattle',
        age: 2, // Default age, should be input by user
        gender: 'Female', // Default gender, should be input by user
        tagId: `TAG_${Date.now()}`,
        imageUri,
        confidence: prediction?.predictions[0]?.confidence || 0,
        feedbackId: `feedback_${Date.now()}`
      };

      const response = await fetch(`${API_BASE_URL}/breed-detection/register-bpa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(animalData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Animal registered to BPA successfully!');
        router.push('/dashboard');
      } else {
        throw new Error('Failed to register animal');
      }
    } catch (error) {
      console.error('BPA registration error:', error);
      Alert.alert('Error', 'Failed to register animal to BPA');
    }
  };

  const handleSelectDifferentBreed = () => {
    setShowBreedSelector(true);
  };

  const handleBreedSelection = (breed: string) => {
    setSelectedBreed(breed);
    setShowBreedSelector(false);
  };

  const goBack = () => {
    router.back();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#4CAF50';
    if (confidence >= 60) return '#FF9800';
    return '#F44336';
  };


  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>AI Analysis</ThemedText>
          <View style={styles.headerButton} />
        </View>

        <View style={styles.analyzingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <ThemedText style={styles.analyzingTitle}>AI Model Processing</ThemedText>
          <ThemedText style={styles.analyzingText}>
            Our advanced AI is analyzing the cattle image to identify the breed and generate heatmaps...
          </ThemedText>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Breed Detection Results</ThemedText>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.animalImage} />
        </View>

        {prediction && (
          <>
            <View style={styles.resultsContainer}>
              <ThemedText style={styles.resultsTitle}>AI Prediction Results</ThemedText>
              
              <View style={styles.primaryResult}>
                <View style={styles.breedInfo}>
                  <ThemedText style={styles.breedLabel}>Predicted Breed:</ThemedText>
                  <ThemedText style={styles.breedName}>{selectedBreed}</ThemedText>
                </View>
                <View style={styles.confidenceContainer}>
                  <ThemedText style={styles.confidenceLabel}>Confidence:</ThemedText>
                  <View style={styles.confidenceBar}>
                    <View 
                      style={[
                        styles.confidenceFill, 
                        { 
                          width: `${prediction.predictions[0]?.confidence || 0}%`,
                          backgroundColor: getConfidenceColor(prediction.predictions[0]?.confidence || 0)
                        }
                      ]} 
                    />
                  </View>
                  <ThemedText style={[styles.confidenceText, { color: getConfidenceColor(prediction.predictions[0]?.confidence || 0) }]}>
                    {prediction.predictions[0]?.confidence || 0}%
                  </ThemedText>
                </View>
              </View>

              <View style={styles.top3Container}>
                <ThemedText style={styles.top3Title}>Top 3 Predictions:</ThemedText>
                {prediction.predictions.map((breed, index) => (
                  <View key={index} style={styles.predictionItem}>
                    <View style={styles.rankContainer}>
                      <ThemedText style={styles.rankNumber}>{breed.rank}</ThemedText>
                    </View>
                    <View style={styles.predictionInfo}>
                      <ThemedText style={styles.predictionBreed}>{breed.breed}</ThemedText>
                      <ThemedText style={styles.predictionConfidence}>{breed.confidence}%</ThemedText>
                    </View>
                    <View style={styles.confidenceBarSmall}>
                      <View 
                        style={[
                          styles.confidenceFillSmall, 
                          { 
                            width: `${breed.confidence}%`,
                            backgroundColor: getConfidenceColor(breed.confidence)
                          }
                        ]} 
                      />
                    </View>
                  </View>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.heatmapButton} 
                onPress={() => setShowHeatmaps(!showHeatmaps)}
              >
                <Ionicons name="eye" size={20} color="#4CAF50" />
                <Text style={styles.heatmapButtonText}>
                  {showHeatmaps ? 'Hide' : 'Show'} Heatmaps
                </Text>
              </TouchableOpacity>

              {showHeatmaps && (
                <View style={styles.heatmapContainer}>
                  <ThemedText style={styles.heatmapTitle}>AI Attention Heatmaps</ThemedText>
                  <View style={styles.heatmapRow}>
                    <View style={styles.heatmapItem}>
                      <ThemedText style={styles.heatmapLabel}>{prediction.heatmapData.breed1}</ThemedText>
                      <Image 
                        source={{ uri: prediction.heatmapData.heatmap1Uri }} 
                        style={styles.heatmapImage}
                        defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' }}
                      />
                    </View>
                    <View style={styles.heatmapItem}>
                      <ThemedText style={styles.heatmapLabel}>{prediction.heatmapData.breed2}</ThemedText>
                      <Image 
                        source={{ uri: prediction.heatmapData.heatmap2Uri }} 
                        style={styles.heatmapImage}
                        defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.selectBreedButton} onPress={handleSelectDifferentBreed}>
                <Ionicons name="list" size={20} color="#4CAF50" />
                <Text style={styles.selectBreedButtonText}>Select Different Breed</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBreed}>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.confirmButtonText}>Register to BPA</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {showBreedSelector && (
        <View style={styles.breedSelectorOverlay}>
          <View style={styles.breedSelectorContainer}>
            <View style={styles.breedSelectorHeader}>
              <ThemedText style={styles.breedSelectorTitle}>Select Breed</ThemedText>
              <TouchableOpacity onPress={() => setShowBreedSelector(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.breedList}>
              {allBreeds.map((breed, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.breedItem,
                    selectedBreed === breed && styles.breedItemSelected
                  ]}
                  onPress={() => handleBreedSelection(breed)}
                >
                  <ThemedText style={[
                    styles.breedItemText,
                    selectedBreed === breed && styles.breedItemTextSelected
                  ]}>
                    {breed}
                  </ThemedText>
                  {selectedBreed === breed && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

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
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  analyzingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 20,
    textAlign: 'center',
  },
  analyzingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  dot1: {},
  dot2: {},
  dot3: {},
  content: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  animalImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  resultsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  primaryResult: {
    marginBottom: 20,
  },
  breedInfo: {
    marginBottom: 15,
  },
  breedLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  breedName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  confidenceContainer: {
    marginBottom: 10,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  top3Container: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 15,
    marginBottom: 20,
  },
  top3Title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  predictionInfo: {
    flex: 1,
  },
  predictionBreed: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  predictionConfidence: {
    fontSize: 14,
    color: '#666',
  },
  confidenceBarSmall: {
    width: 60,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFillSmall: {
    height: '100%',
    borderRadius: 2,
  },
  heatmapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#F8F9FA',
    marginBottom: 15,
  },
  heatmapButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  heatmapContainer: {
    marginTop: 10,
  },
  heatmapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  heatmapRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  heatmapItem: {
    alignItems: 'center',
  },
  heatmapLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  heatmapImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15,
  },
  selectBreedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#FFFFFF',
  },
  selectBreedButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  breedSelectorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breedSelectorContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
    width: '90%',
  },
  breedSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  breedSelectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  breedList: {
    maxHeight: 300,
  },
  breedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  breedItemSelected: {
    backgroundColor: '#E8F5E8',
  },
  breedItemText: {
    fontSize: 16,
    color: '#333',
  },
  breedItemTextSelected: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});