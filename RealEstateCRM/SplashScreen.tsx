import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
} from 'react-native';

// Import logo
import logo from './assets/images/Logo.png';

interface SplashScreenProps {
  onSplashComplete: () => void;
}

function SplashScreen({ onSplashComplete }: SplashScreenProps): React.JSX.Element {
  useEffect(() => {
    // Auto-navigate after 2 seconds
    const timer = setTimeout(() => {
      onSplashComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onSplashComplete]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen; 