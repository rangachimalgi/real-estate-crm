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
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildApiUrl, API_CONFIG } from './config/api';

// Import logo
import logo from './assets/images/Logo.png';

function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login with:', { username, password: '***' });
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Save user data to AsyncStorage
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('screens', JSON.stringify(data.user.screens));
        
        console.log('Login successful, saved screens:', data.user.screens);
        console.log('Full user data:', data.user);
        
        // Navigate to main screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' as never }],
        });
      } else {
        console.log('Login failed:', data.error);
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Network error occurred';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Server is taking too long to respond. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Connection Error', errorMessage);
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

        {/* Demo credentials info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoTitle}>Demo Credentials:</Text>
          <Text style={styles.demoText}>• Super Admin: admin / admin123 (All screens)</Text>
          <Text style={styles.demoText}>• Manager: manager / manager123 (Limited access)</Text>
          <Text style={styles.demoText}>• Executive: executive / exec123 (Basic access)</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#999"
              autoCapitalize="none"
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
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Connecting to server...' : 'Log In'}
          </Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Register</Text>
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
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 30,
    height: 120,
    position: 'relative',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  demoInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FADB43',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FADB43',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    width: '80%',
  },
  loginButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  registerLink: {
    color: '#FADB43',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 