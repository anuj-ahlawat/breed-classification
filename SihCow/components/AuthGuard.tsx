import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ThemedText } from './themed-text';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated
    // Don't redirect on network errors or during initial load
    if (!isLoading && !user) {
      // Add a small delay to prevent immediate redirects during app startup
      const timer = setTimeout(() => {
        router.replace('/signin');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </View>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
