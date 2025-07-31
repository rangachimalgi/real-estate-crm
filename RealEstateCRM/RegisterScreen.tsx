import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import logo
import logo from './assets/images/Logo.png';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

function RegisterScreen({ onNavigateToLogin, onNavigateToSignUp }: RegisterScreenProps): React.JSX.Element {
  const handleLogin = () => {
    console.log('Login pressed');
    onNavigateToLogin();
  };

  const handleSignUp = () => {
    console.log('Sign Up pressed');
    onNavigateToSignUp();
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
        {/* <Text style={styles.title}>Hello</Text> */}
        <Text style={styles.subtitle}>Welcome To Virtue Infra Builders Pvt Ltd, where you manage you daily tasks</Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
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
    height: 120,
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
    marginVertical: 40,
    height: 120,
    position: 'relative',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#FADB43',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
    width: '80%',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FADB43',
    alignSelf: 'center',
    width: '80%',
  },
  signUpButtonText: {
    color: '#FADB43',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialContainer: {
    alignItems: 'center',
  },
  socialText: {
    color: '#7f8c8d',
    fontSize: 14,
    marginBottom: 15,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialIconText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 