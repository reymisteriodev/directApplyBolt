import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const onboardingSteps = [
    {
      title: 'Welcome to\nDirectApply',
      subtitle: 'Find your next dream job,\none swipe at a time.',
      icon: '🚀',
      animation: 'fadeInUp',
    },
    {
      title: 'Swipe Right to Apply.\nSwipe Left to Pass.',
      subtitle: "It's that easy.",
      icon: '❤️',
      animation: 'slideInRight',
    },
    {
      title: 'Your Profile is the Key',
      subtitle: 'To find your perfect match,\nwe need your profile first.',
      icon: '🔑',
      animation: 'fadeInUp',
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Move to sign in step
      setCurrentStep(onboardingSteps.length);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert('Sign In Failed', error.message || 'Please check your credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderOnboardingStep = () => {
    const step = onboardingSteps[currentStep];
    
    return (
      <Animatable.View 
        key={currentStep}
        animation={step.animation}
        duration={800}
        style={styles.stepContainer}
      >
        <Text style={styles.icon}>{step.icon}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.subtitle}>{step.subtitle}</Text>
        
        {currentStep === 1 && (
          <Animatable.View 
            animation="pulse" 
            iterationCount="infinite" 
            style={styles.swipeDemo}
          >
            <View style={styles.demoCard}>
              <Text style={styles.demoText}>Senior Developer</Text>
              <Text style={styles.demoCompany}>TechCorp</Text>
            </View>
          </Animatable.View>
        )}
      </Animatable.View>
    );
  };

  const renderSignInForm = () => (
    <Animatable.View animation="fadeInUp" duration={800} style={styles.loginContainer}>
      <Text style={styles.loginTitle}>Sign In to Continue</Text>
      
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity 
        style={[styles.signInButton, loading && styles.disabledButton]}
        onPress={handleSignIn}
        disabled={loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FF6B35', '#F7931E']}
          style={styles.buttonGradient}
        >
          <Text style={styles.signInButtonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.helpText}>
        Don't have an account? Please sign up on the web platform first.
      </Text>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {currentStep < onboardingSteps.length ? (
            <>
              {renderOnboardingStep()}
              
              {/* Progress Dots */}
              <View style={styles.dotsContainer}>
                {onboardingSteps.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === currentStep && styles.activeDot,
                    ]}
                  />
                ))}
              </View>

              {/* Next Button */}
              <TouchableOpacity 
                style={styles.nextButton} 
                onPress={handleNext}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>
                  {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            renderSignInForm()
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  icon: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 38,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  swipeDemo: {
    marginTop: 40,
  },
  demoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    width: 200,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  demoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  demoCompany: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 30,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 40,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  signInButton: {
    width: '100%',
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  helpText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});

export default OnboardingScreen;