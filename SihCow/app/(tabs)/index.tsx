import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Alert, Image, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { AuthGuard } from '../../components/AuthGuard';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  const handleCapturePhoto = () => {
    router.push('/camera');
  };

  const handleUploadFromGallery = () => {
    router.push('/gallery');
  };

  const handleViewRegisteredAnimals = () => {
    router.push('/registered');
  };

  const handleViewBreeds = () => {
    router.push('/breeds');
  };

  const handleHelp = () => {
    router.push('/help');
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Language Selection',
      'Language change functionality will be implemented here.',
      [{ text: 'OK' }]
    );
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

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <AuthGuard>
      <ThemedView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.mainTitle}>भारत पशुधन</Text>
              <Text style={styles.subTitle}>Breed Identifier</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.languageButton} onPress={handleLanguageChange}>
                <Text style={styles.languageText}>A</Text>
                <Text style={styles.languageTextSmall}>EN</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.helpButton} onPress={handleHelp}>
                <Ionicons name="help-outline" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.dashboardButton} onPress={handleDashboard}>
                <Ionicons name="person-circle-outline" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Ionicons name="log-out-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Government Banner */}
          <View style={styles.governmentBanner}>
            <View style={styles.flagIcon}>
              <Text style={styles.flagText}>🇮🇳</Text>
            </View>
            <Text style={styles.governmentText}>
              Government of India • Department of Animal Husbandry & Dairying
            </Text>
          </View>

          {/* Select Action Section */}
          <Text style={styles.sectionTitle}>Select Action • कार्य चुनें</Text>
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.greenButton]} onPress={handleCapturePhoto}>
              <Ionicons name="camera" size={32} color="white" style={styles.actionIcon} />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionButtonTitle}>Capture Animal Photo</Text>
                <Text style={styles.actionButtonSubtitle}>Take photo of cattle or buffalo • पशु की फोटो लें</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.blueButton]} onPress={handleUploadFromGallery}>
              <Ionicons name="images" size={32} color="white" style={styles.actionIcon} />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionButtonTitle}>Upload from Gallery</Text>
                <Text style={styles.actionButtonSubtitle}>Select existing photo • गैलरी से चुनें</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.purpleButton]} onPress={handleViewRegisteredAnimals}>
              <Ionicons name="folder-open" size={32} color="white" style={styles.actionIcon} />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionButtonTitle}>View Registered Animals</Text>
                <Text style={styles.actionButtonSubtitle}>See saved animals • पंजीकृत पशु देखें</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.orangeButton]} onPress={handleViewBreeds}>
              <Ionicons name="library" size={32} color="white" style={styles.actionIcon} />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionButtonTitle}>View Breed Database</Text>
                <Text style={styles.actionButtonSubtitle}>Browse all breeds • सभी नस्लें देखें</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Supported Breeds Section */}
          <Text style={styles.sectionTitle}>Supported Breeds • समर्थित नस्लें</Text>
          
          <View style={styles.supportedBreedsContainer}>
            <View style={styles.breedCard}>
              <Text style={[styles.breedCount, { color: '#28a745' }]}>18+</Text>
              <Ionicons name="leaf" size={28} color="#28a745" style={styles.breedIcon} />
              <Text style={styles.breedType}>Cattle</Text>
              <Text style={styles.breedTypeHindi}>गाय</Text>
            </View>
            
            <View style={styles.breedCard}>
              <Text style={[styles.breedCount, { color: '#007bff' }]}>9+</Text>
              <Ionicons name="water" size={28} color="#007bff" style={styles.breedIcon} />
              <Text style={styles.breedType}>Buffalo</Text>
              <Text style={styles.breedTypeHindi}>भैंस</Text>
            </View>
            
            <View style={styles.breedCard}>
              <Text style={[styles.breedCount, { color: '#dc3545' }]}>AI</Text>
              <Ionicons name="bulb" size={28} color="#dc3545" style={styles.breedIcon} />
              <Text style={styles.breedType}>Powered</Text>
              <Text style={styles.breedTypeHindi}>एआई</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>For Field Level Workers • फील्ड स्तर के कर्मचारियों के लिए</Text>
            <Text style={styles.footerVersion}>Version 1.0.0 • Offline Support Available</Text>
          </View>
        </ScrollView>
        </SafeAreaView>
      </ThemedView>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  titleContainer: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: -5,
  },
  subTitle: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageButton: {
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  languageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  languageTextSmall: {
    fontSize: 8,
    color: '#000',
    marginTop: -2,
  },
  helpButton: {
    backgroundColor: '#fff3cd',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dashboardButton: {
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  signOutButton: {
    backgroundColor: '#f8d7da',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  governmentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 25,
  },
  flagIcon: {
    marginRight: 8,
  },
  flagText: {
    fontSize: 16,
  },
  governmentText: {
    fontSize: 11,
    color: '#6c757d',
    flex: 1,
    lineHeight: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  actionButtonsContainer: {
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greenButton: {
    backgroundColor: '#28a745',
  },
  blueButton: {
    backgroundColor: '#007bff',
  },
  purpleButton: {
    backgroundColor: '#6f42c1',
  },
  orangeButton: {
    backgroundColor: '#fd7e14',
  },
  actionIcon: {
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 16,
  },
  supportedBreedsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 30,
  },
  breedCard: {
    alignItems: 'center',
    flex: 1,
  },
  breedCount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  breedIcon: {
    marginBottom: 8,
  },
  breedType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  breedTypeHindi: {
    fontSize: 11,
    color: '#6c757d',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 4,
    textAlign: 'center',
  },
  footerVersion: {
    fontSize: 9,
    color: '#6c757d',
    textAlign: 'center',
  },
});