import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Animal = any;

export default function RegisteredAnimalsScreen() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const fetchAnimals = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Please sign in to view your animals');
        router.replace('/signin');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/animals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setAnimals(data);
      } else if (res.status === 401) {
        Alert.alert('Session Expired', 'Please sign in again');
        router.replace('/signin');
      }
    } catch (e) {
      console.error('Error fetching animals:', e);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnimals();
    setRefreshing(false);
  };

  const handleAddNew = () => {
    router.push('/(tabs)');
  };

  const handleViewDetails = (animal: any) => {
    Alert.alert(
      'Animal Details',
      `Breed: ${animal.breed}\nType: ${animal.animalType}\nAge: ${animal.age} years\nGender: ${animal.gender}\nTag ID: ${animal.tagId}\nLocation: ${animal.location}\nOwner: ${animal.ownerName}\nConfidence: ${animal.confidence}%\nRegistered: ${animal.registrationDate}`,
      [{ text: 'OK' }]
    );
  };

  const handleEditAnimal = (animal: any) => {
    Alert.alert('Edit Animal', 'Edit functionality would be implemented here');
  };

  const handleDeleteAnimal = (animalId: string) => {
    Alert.alert(
      'Delete Animal',
      'Are you sure you want to delete this animal record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              if (!token) {
                Alert.alert('Error', 'Please sign in to delete animals');
                return;
              }

              const res = await fetch(`${API_BASE_URL}/animals/${animalId}`, { 
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              
              if (res.ok) {
                setAnimals(prev => prev.filter((animal: any) => animal._id !== animalId));
              } else if (res.status === 401) {
                Alert.alert('Session Expired', 'Please sign in again');
                router.replace('/signin');
              } else {
                Alert.alert('Error', 'Failed to delete animal');
              }
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete animal');
            }
          }
        }
      ]
    );
  };

  const goBack = () => {
    router.back();
  };

  const renderAnimalItem = ({ item }: { item: any }) => (
    <View style={styles.animalCard}>
      <Image source={{ uri: item.imageUri }} style={styles.animalImage} />
      
      <View style={styles.animalInfo}>
        <View style={styles.animalHeader}>
          <ThemedText style={styles.breedName}>{item.breed}</ThemedText>
          <View style={styles.confidenceBadge}>
            <ThemedText style={styles.confidenceText}>{item.confidence}%</ThemedText>
          </View>
        </View>
        
        <ThemedText style={styles.animalType}>{item.animalType}</ThemedText>
        <ThemedText style={styles.animalDetails}>
          {item.gender} • {item.age} years • {item.tagId}
        </ThemedText>
        <ThemedText style={styles.ownerName}>Owner: {item.ownerName}</ThemedText>
        <ThemedText style={styles.location}>{item.location}</ThemedText>
        <ThemedText style={styles.registrationDate}>
          Registered: {new Date(item.registrationDate).toLocaleDateString()}
        </ThemedText>
      </View>

      <View style={styles.animalActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleViewDetails(item)}
        >
          <Ionicons name="eye" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleEditAnimal(item)}
        >
          <Ionicons name="pencil" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleDeleteAnimal(item._id)}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="list-outline" size={80} color="#CCCCCC" />
      <ThemedText style={styles.emptyTitle}>No Animals Registered</ThemedText>
      <ThemedText style={styles.emptyMessage}>
        Start by capturing or uploading animal photos to register them in the system.
      </ThemedText>
      <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
        <Ionicons name="add-circle" size={24} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Add First Animal</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Registered Animals</ThemedText>
        <TouchableOpacity style={styles.headerButton} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>{animals.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total Animals</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>
            {animals.filter(a => a.animalType === 'Cattle').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Cattle</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>
            {animals.filter(a => a.animalType === 'Buffalo').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Buffalo</ThemedText>
        </View>
      </View>

      {animals.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={animals}
          renderItem={renderAnimalItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
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
  statsContainer: {
    flexDirection: 'row',
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
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  animalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  animalImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  animalInfo: {
    flex: 1,
  },
  animalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  breedName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  confidenceText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  animalType: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  animalDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  ownerName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  registrationDate: {
    fontSize: 12,
    color: '#999',
  },
  animalActions: {
    justifyContent: 'space-around',
    paddingLeft: 10,
  },
  actionButton: {
    padding: 8,
    marginVertical: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
