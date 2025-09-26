import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { Alert } from 'react-native';
// Mock breed data
const breedData = [
  {
    id: 1,
    name: 'Alambadi',
    origin: 'Tamil Nadu',
    characteristics: 'Medium size, adapted to local climate',
    lactationYield: '800-1200 kg/lactation',
    type: 'Cattle',
    image: 'assets/breeds/Alambadi_1.png'
  },
  
    {
      id: 2,
      name: 'Amritmahal',
      origin: 'Karnataka',
      characteristics: 'Strong build, draught tolerant',
      lactationYield: '1000-1500 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Amritmahal_1.JPG'
    },
    {
      id: 3,
      name: 'Ayrshire',
      origin: 'Scotland',
      characteristics: 'Red and white, hardy, good milk quality',
      lactationYield: '1200-2000 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Ayrshire_1.jpg'
    },
    {
      id: 4,
      name: 'Banni',
      origin: 'Gujarat',
      characteristics: 'Medium sized, heat tolerant, drought resistant',
      lactationYield: '1000-1800 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/banni.png'
    },
    {
      id: 5,
      name: 'Bargur',
      origin: 'Tamil Nadu',
      characteristics: 'Humped cattle, medium frame, draught animal',
      lactationYield: '800-1200 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Bargur_4.JPG'
    },
    {
      id: 6,
      name: 'Bhadawari',
      origin: 'Uttar Pradesh',
      characteristics: 'Water buffalo, high fat content milk',
      lactationYield: '1200-2000 kg/lactation',
      type: 'Buffalo',
      image: 'assets/breeds/Bhadawari_1.jpg'
    },
    {
      id: 7,
      name: 'Brown Swiss',
      origin: 'Switzerland',
      characteristics: 'Large size, brown coat, high milk production',
      lactationYield: '1500-2500 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Brown_Swiss_1.jpg'
    },
    {
      id: 8,
      name: 'Dangi',
      origin: 'Maharashtra',
      characteristics: 'Medium size, sturdy, used for draught',
      lactationYield: '800-1500 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/dangi.jpg'
    },
    {
      id: 9,
      name: 'Deoni',
      origin: 'Maharashtra',
      characteristics: 'Humped, multipurpose cattle, good draught power',
      lactationYield: '1000-1800 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Deoni_1.JPG'
    },
    {
      id: 10,
      name: 'Gir',
      origin: 'Gujarat',
      characteristics: 'Distinctive curved horns, pendulous ears, compact body',
      lactationYield: '1200-1800 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Gir_1.JPG'
    },
    {
      id: 11,
      name: 'Guernsey',
      origin: 'Channel Islands',
      characteristics: 'Golden red and white, gentle temperament',
      lactationYield: '1200-2000 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Guernsey_1.jpg'
    },
    {
      id: 12,
      name: 'Hallikar',
      origin: 'Karnataka',
      characteristics: 'Long curved horns, draught cattle',
      lactationYield: '900-1500 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Hallikar_1.JPG'
    },
    {
      id: 13,
      name: 'Hariana',
      origin: 'Haryana',
      characteristics: 'Medium frame, grey coat, draught and milk cattle',
      lactationYield: '1200-1800 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Hariana_1.JPG'
    },
    {
      id: 14,
      name: 'Holstein Friesian',
      origin: 'Netherlands/Germany',
      characteristics: 'Black and white, high milk yield',
      lactationYield: '2500-4000 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Holstein_Friesian_1.jpg'
    },
    {
      id: 15,
      name: 'Jaffrabadi',
      origin: 'Gujarat',
      characteristics: 'Large size, massive horns, high butterfat content',
      lactationYield: '1000-2000 kg/lactation',
      type: 'Buffalo',
      image: 'assets/breeds/Jaffrabadi_2.JPG'
    },
    {
      id: 16,
      name: 'Jersey',
      origin: 'Jersey Island',
      characteristics: 'Small size, fawn color, rich milk',
      lactationYield: '1000-2000 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Jersey_1.jpg'
    },
    {
      id: 17,
      name: 'Kangayam',
      origin: 'Tamil Nadu',
      characteristics: 'Medium frame, strong draught cattle',
      lactationYield: '800-1200 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Kangayam_1.JPG'
    },
    {
      id: 18,
      name: 'Kankrej',
      origin: 'Rajasthan/Gujarat',
      characteristics: 'Humped, draught and milk purpose',
      lactationYield: '1200-2000 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Kankrej_1.JPG'
    },
    {
      id: 19,
      name: 'Kasargod',
      origin: 'Kerala',
      characteristics: 'Small, hardy, draught cattle',
      lactationYield: '800-1200 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Kasargod_1.JPG'
    },
    {
      id: 20,
      name: 'Kenkatha',
      origin: 'Madhya Pradesh',
      characteristics: 'Drought tolerant, small frame',
      lactationYield: '800-1200 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Kenkatha_1.JPG'
    },
    {
      id: 21,
      name: 'Kherigarh',
      origin: 'Uttar Pradesh',
      characteristics: 'Medium size, draught and milk cattle',
      lactationYield: '1000-1500 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Kherigarh_1.JPG'
    },
    {
      id: 22,
      name: 'Khillari',
      origin: 'Maharashtra',
      characteristics: 'Strong, drought tolerant, draught cattle',
      lactationYield: '900-1500 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Khillari_1.JPG'
    },
    {
      id: 23,
      name: 'Krishna Valley',
      origin: 'Maharashtra',
      characteristics: 'Heavy draught breed, dark coat',
      lactationYield: '1000-1800 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Krishna_Valley_1.JPG'
    },
    {
      id: 24,
      name: 'Malnad Gidda',
      origin: 'Karnataka',
      characteristics: 'Small size, hardy, heat tolerant',
      lactationYield: '600-1000 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/maland.png'
    },
    {
      id: 25,
      name: 'Mehsana',
      origin: 'Gujarat',
      characteristics: 'Dairy buffalo, high milk yield',
      lactationYield: '1500-2500 kg/lactation',
      type: 'Buffalo',
      image: 'assets/breeds/Mehsana_3.JPG'
    },
    {
      id: 26,
      name: 'Murrah',
      origin: 'Haryana',
      characteristics: 'Jet black color, massive body, high milk yield',
      lactationYield: '1500-2500 kg/lactation',
      type: 'Buffalo',
      image: 'assets/breeds/Murrah_4.jpg'
    },
    {
      id: 27,
      name: 'Nagori',
      origin: 'Madhya Pradesh',
      characteristics: 'Medium frame, drought tolerant',
      lactationYield: '800-1200 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/nagori.png'
    },
    {
      id: 28,
      name: 'Nagpuri',
      origin: 'Maharashtra',
      characteristics: 'Humped cattle, draught and milk',
      lactationYield: '1000-1500 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Nagpuri_1.JPG'
    },
    {
      id: 29,
      name: 'Nili Ravi',
      origin: 'Pakistan',
      characteristics: 'Large buffalo, high milk yield',
      lactationYield: '1500-3000 kg/lactation',
      type: 'Buffalo',
      image: 'assets/breeds/Nili_Ravi_1.jpg'
    },
    {
      id: 30,
      name: 'Nimari',
      origin: 'Madhya Pradesh',
      characteristics: 'Medium size, hardy cattle',
      lactationYield: '800-1200 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/nimari.jpg'
    },
    {
      id: 31,
      name: 'Ongole',
      origin: 'Andhra Pradesh',
      characteristics: 'Large, humped cattle, draught and milk',
      lactationYield: '1200-2000 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Ongole_1.JPG'
    },
    {
      id: 32,
      name: 'Pulikulam',
      origin: 'Tamil Nadu',
      characteristics: 'Small frame, hardy cattle',
      lactationYield: '700-1200 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Pulikulam_1.JPG'
    },
    {
      id: 33,
      name: 'Rathi',
      origin: 'Rajasthan',
      characteristics: 'Red and white, medium frame, drought resistant',
      lactationYield: '1000-1800 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/rathi.jpg'
    },
    {
      id: 34,
      name: 'Red Dane',
      origin: 'Denmark',
      characteristics: 'Red coat, dairy cattle',
      lactationYield: '1500-2500 kg/lactation',
      type: 'Cattle',
      image: '/assets/breeds/Red_Dane_7.JPG'
    },
    {
      id: 35,
      name: 'Red Sindhi',
      origin: 'Sindh/Pakistan',
      characteristics: 'Deep red color, medium size, good milk producer',
      lactationYield: '1500-2500 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Red_Sindhi_1.JPG'
    },
    {
      id: 36,
      name: 'Sahiwal',
      origin: 'Punjab/Pakistan',
      characteristics: 'Reddish brown color, loose skin, heat tolerant',
      lactationYield: '2000-3000 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Sahiwal_1.JPG'
    },
    {
      id: 37,
      name: 'Surti',
      origin: 'Gujarat',
      characteristics: 'Medium size, dairy buffalo, good milk yield',
      lactationYield: '1200-1800 kg/lactation',
      type: 'Buffalo',
      image: 'assets/breeds/Surti_8.png'
    },
    {
      id: 38,
      name: 'Tharparkar',
      origin: 'Rajasthan',
      characteristics: 'White to light grey color, large frame, drought resistant',
      lactationYield: '1000-1800 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Tharparkar_1.JPG'
    },
    {
      id: 39,
      name: 'Toda',
      origin: 'Tamil Nadu',
      characteristics: 'Small, rare breed, adapted to hills',
      lactationYield: '500-1000 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/Toda_1.jpg'
    },
    {
      id: 40,
      name: 'Umblachery',
      origin: 'Tamil Nadu',
      characteristics: 'Buffalo, small to medium size, hardy',
      lactationYield: '800-1500 kg/lactation',
      type: 'Buffalo',
      image: 'assets/breeds/Umblachery_1.JPG'
    },
    {
      id: 41,
      name: 'Vechur',
      origin: 'Kerala',
      characteristics: 'Smallest cattle breed, hardy, low maintenance',
      lactationYield: '300-600 kg/lactation',
      type: 'Cattle',
      image: 'assets/breeds/vechur.jpg'
    }
  
  
];

export default function BreedsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredBreeds = breedData.filter(breed => {
    const matchesSearch = breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         breed.origin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || breed.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const goBack = () => {
    router.back();
  };

  const handleBreedPress = (breed: any) => {
    // Navigate to breed details
    Alert.alert('Breed Details', `${breed.name} - ${breed.origin}`);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Breed Database</Text>
          <View style={styles.headerSpacer} />
        </View>

     
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search breeds..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>

       
        <View style={styles.filterContainer}>
          {['All', 'Cattle', 'Buffalo'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        
        <ScrollView style={styles.breedList} showsVerticalScrollIndicator={false}>
          {filteredBreeds.map((breed) => (
            <TouchableOpacity
              key={breed.id}
              style={styles.breedCard}
              onPress={() => handleBreedPress(breed)}
            >
              <Image source={{ uri: breed.image }} style={styles.breedImage} />
              <View style={styles.breedInfo}>
                <View style={styles.breedHeader}>
                  <Text style={styles.breedName}>{breed.name}</Text>
                  <View style={[
                    styles.typeTag,
                    { backgroundColor: breed.type === 'Cattle' ? '#007bff' : '#ffc107' }
                  ]}>
                    <Text style={styles.typeTagText}>{breed.type}</Text>
                  </View>
                </View>
                <Text style={styles.breedOrigin}>Origin: {breed.origin}</Text>
                <Text style={styles.breedCharacteristics} numberOfLines={2}>
                  {breed.characteristics}
                </Text>
                <Text style={styles.lactationYield}>{breed.lactationYield}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </ScrollView>

       
        <View style={styles.bottomNav}>
          
          
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#28a745',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  breedList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  breedCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  breedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  breedInfo: {
    flex: 1,
  },
  breedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  breedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  typeTagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  breedOrigin: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  breedCharacteristics: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginBottom: 4,
  },
  lactationYield: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#007bff',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navTextActive: {
    color: '#28a745',
  },
});

