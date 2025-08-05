import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildApiUrl, API_CONFIG } from './config/api';

// Import logo
import logo from './assets/images/Logo.png';

interface SignUpScreenProps {
  onNavigateToLogin: () => void;
  onSignUpSuccess: () => void;
}

function SignUpScreen({ onNavigateToLogin, onSignUpSuccess }: SignUpScreenProps): React.JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting sign up with:', { name, email, password: '***' });
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          username: email // Using email as username for now
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('screens', JSON.stringify(data.user.screens || []));
        
        console.log('Sign up successful');
        onSignUpSuccess();
      } else {
        console.log('Sign up failed:', data.error);
        Alert.alert('Sign Up Failed', data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Network error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with decorative elements */}
        <View style={styles.header}>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.star1} />
          <View style={styles.star2} />
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image source={logo} style={styles.logo} />
        </View>

        {/* Title */}
        {/* <Text style={styles.title}>Sign Up</Text> */}

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity 
          style={[styles.signUpButton, isLoading && styles.disabledButton]} 
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.signUpButtonText}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    height: 80,
    position: 'relative',
    width: '100%',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  decorativeCircle2: {
    position: 'absolute',
    top: 40,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2c3e50',
  },
  star1: {
    position: 'absolute',
    top: 60,
    left: 40,
    width: 20,
    height: 20,
    backgroundColor: '#e0e0e0',
    transform: [{ rotate: '45deg' }],
  },
  star2: {
    position: 'absolute',
    bottom: 20,
    right: 50,
    width: 15,
    height: 15,
    backgroundColor: '#e0e0e0',
    transform: [{ rotate: '45deg' }],
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 30,
    height: 120,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  inputField: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
    color: '#2c3e50',
  },
  signUpButton: {
    backgroundColor: '#FADB43',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    width: '80%',
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  loginLink: {
    color: '#FADB43',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignUpScreen; 