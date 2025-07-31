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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import logo
import logo from './assets/images/Logo.png';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

function LoginScreen({ onNavigateToRegister, onLoginSuccess }: LoginScreenProps): React.JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Hardcoded login logic - always redirect to home
    console.log('Login successful');
    onLoginSuccess();
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
        {/* <Text style={styles.title}>Login</Text> */}

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <View style={styles.inputField}>
            <TextInput
              style={styles.input}
              placeholder="Name"
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
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
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