import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';

export default function GalleryScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photo library to select images for breed identification.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const proceedWithImage = () => {
    if (selectedImage) {
      router.push({
        pathname: '/breed-detection',
        params: { imageUri: selectedImage }
      });
    }
  };

  const goBack = () => {
    router.back();
  };

  const retakeImage = () => {
    setSelectedImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Upload from Gallery</ThemedText>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content}>
        {!selectedImage ? (
          <View style={styles.uploadContainer}>
            <View style={styles.uploadIcon}>
              <Ionicons name="images-outline" size={80} color="#4CAF50" />
            </View>
            <ThemedText style={styles.uploadTitle}>Select Animal Photo</ThemedText>
            <ThemedText style={styles.uploadText}>
              Choose a clear photo of the animal from your gallery for breed identification.
            </ThemedText>
            
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Ionicons name="folder-open" size={24} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <View style={styles.tipsContainer}>
              <ThemedText style={styles.tipsTitle}>📸 Tips for Best Results:</ThemedText>
              <View style={styles.tipsList}>
                <ThemedText style={styles.tipItem}>• Animal should be clearly visible</ThemedText>
                <ThemedText style={styles.tipItem}>• Good lighting is important</ThemedText>
                <ThemedText style={styles.tipItem}>• Avoid blurry or dark images</ThemedText>
                <ThemedText style={styles.tipItem}>• Side view of the animal works best</ThemedText>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.previewContainer}>
            <ThemedText style={styles.previewTitle}>Selected Image</ThemedText>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.retakeButton} onPress={retakeImage}>
                <Ionicons name="refresh" size={20} color="#4CAF50" />
                <Text style={styles.retakeButtonText}>Choose Different</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.proceedButton} onPress={proceedWithImage}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.proceedButtonText}>Proceed to Analysis</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  uploadContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: 'center',
  },
  uploadIcon: {
    marginBottom: 30,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: '#E8F5E8',
    padding: 20,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#4CAF50',
    lineHeight: 20,
  },
  previewContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15,
  },
  retakeButton: {
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
  retakeButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  proceedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
