import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';

// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import SwipeScreen from './src/screens/SwipeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Context
import { AuthProvider } from './src/contexts/AuthContext';
import { JobProvider } from './src/contexts/JobContext';

// Navigation
import TabNavigator from './src/navigation/TabNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';

// Utils
import { initializeSupabase } from './src/utils/supabase';

export default function App() {
  useEffect(() => {
    initializeSupabase();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <JobProvider>
          <NavigationContainer>
            <AuthNavigator />
          </NavigationContainer>
          <StatusBar style="auto" />
        </JobProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}