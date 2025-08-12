import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';

// Using Ionicons from react-native-vector-icons
// Install with: npm install react-native-vector-icons
// Then link fonts: npx react-native link react-native-vector-icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import SignUpScreen from './SignUpScreen';
import SplashScreen from './SplashScreen';
import DeskPanelScreen from './DeskPanelScreen';
import ProjectsScreen from './ProjectsScreen';

// Remove the loadFont call as it's not needed in newer versions
// Ionicons.loadFont();

type Screen = 'splash' | 'login' | 'register' | 'signup' | 'main' | 'deskPanel' | 'projects';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive breakpoints
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 768;
const isLargeDevice = screenWidth >= 768;

// Responsive scaling functions
const scale = (size: number) => {
  if (isSmallDevice) return size * 0.8;
  if (isMediumDevice) return size;
  return size * 1.2;
};

const scaleWidth = (size: number) => {
  if (isSmallDevice) return size * 0.9;
  if (isMediumDevice) return size;
  return size * 1.1;
};

const scaleHeight = (size: number) => {
  if (isSmallDevice) return size * 0.9;
  if (isMediumDevice) return size;
  return size * 1.1;
};

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'chat' | 'settings'>('home');
  const [iconsLoaded, setIconsLoaded] = useState(false);
  const [allowedScreens, setAllowedScreens] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if icons are working
    try {
      // Test if Ionicons is working
      const testIcon = Ionicons.getImageSource('home', 24, '#000');
      setIconsLoaded(true);
    } catch (error) {
      console.log('Icons not loaded properly:', error);
      Alert.alert('Icons Issue', 'Vector icons are not properly configured. Please check the setup instructions.');
    }
  }, []);

  // Load user data and allowed screens when main screen is shown
  useEffect(() => {
    if (currentScreen === 'main') {
      loadUserData();
    }
  }, [currentScreen]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const screensData = await AsyncStorage.getItem('screens');
      
      if (userData) {
        setUser(JSON.parse(userData));
      }
      
      if (screensData) {
        const screens = JSON.parse(screensData);
        setAllowedScreens(screens);
        console.log('Loaded allowed screens:', screens);
        console.log('Available menu options:', allMenuOptions.map(o => o.key));
        console.log('Filtered menu options:', allMenuOptions.filter(option => screens.includes(option.key)).map(o => o.title));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Define all available menu options
  const allMenuOptions = [
    { id: 1, title: 'Dashboard', key: 'Dashboard', icon: '📊', description: 'View dashboard and analytics' },
    { id: 2, title: 'Leads', key: 'Leads', icon: '🧍', description: 'Track potential leads' },
    { id: 3, title: 'Projects', key: 'Projects', icon: '🏗️', description: 'View all projects' },
    { id: 4, title: 'Properties', key: 'Properties', icon: '🏠', description: 'Manage property listings' },
    { id: 5, title: 'Bookings', key: 'Bookings', icon: '📦', description: 'Handle booking requests' },
    { id: 6, title: 'Reports', key: 'Reports', icon: '📈', description: 'View analytics and reports' },
    { id: 7, title: 'Desk Panel', key: 'DeskPanel', icon: '🖥️', description: 'Access desk management tools' },
  ];

  // Filter menu options based on allowed screens
  const menuOptions = allMenuOptions.filter(option => 
    allowedScreens.includes(option.key)
  );

  // Ionicons names: 'home-outline', 'search-outline', 'person-outline' and filled variants
  const bottomTabs = [
    { id: 'home', icon: 'home-outline', activeIcon: 'home' },
    // { id: 'search', icon: 'search-outline', activeIcon: 'search' },
    { id: 'chat', icon: 'chatbubble-outline', activeIcon: 'chatbubble' },
    { id: 'settings', icon: 'settings-outline', activeIcon: 'settings' },
  ] as const;

  const handleMenuPress = (option: typeof menuOptions[number]) => {
    console.log(`Pressed: ${option.title}`);
    
    // Handle navigation based on menu option
    switch (option.key) {
      case 'DeskPanel':
        setCurrentScreen('deskPanel');
        break;
      case 'Projects':
        setCurrentScreen('projects');
        break;
      default:
        // TODO: navigate to other screens
        console.log(`Navigation to ${option.key} not implemented yet`);
    }
  };

  const handleTabPress = (tabId: typeof bottomTabs[number]['id']) => {
    setActiveTab(tabId);
    console.log(`Switched to: ${tabId}`);
    // TODO: navigate
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleNavigateToRegister = () => {
    setCurrentScreen('register');
  };

  const handleNavigateToSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('main');
  };

  const handleRegisterSuccess = () => {
    setCurrentScreen('main');
  };

  const handleSignUpSuccess = () => {
    setCurrentScreen('main');
  };

  const handleSplashComplete = () => {
    setCurrentScreen('register');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('screens');
      setAllowedScreens([]);
      setUser(null);
      setCurrentScreen('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderContent = () => {
    if (activeTab === 'home') {
      return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User info header */}
          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
              <Text style={styles.roleText}>Role: {user.role}</Text>
            </View>
          )}
          
          <View style={styles.menuGrid}>
            {menuOptions.map(o => (
              <TouchableOpacity
                key={o.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(o)}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{o.icon}</Text>
                <Text style={styles.menuTitle}>{o.title}</Text>
                <Text style={styles.menuDescription}>{o.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      );
    }

    if (activeTab === 'search') {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.tabTitle}>Search Properties</Text>
          <Text style={styles.tabSubtitle}>Find your perfect property</Text>
        </View>
      );
    }

    if (activeTab === 'chat') {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.tabTitle}>Chat</Text>
          <Text style={styles.tabSubtitle}>Manage conversations</Text>
        </View>
      );
    }

    if (activeTab === 'settings') {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.tabTitle}>Settings</Text>
          <Text style={styles.tabSubtitle}>Configure your preferences</Text>
        </View>
      );
    }

    return null;
  };

  // Render different screens based on current screen state
  if (currentScreen === 'splash') {
    return (
      <SplashScreen
        onSplashComplete={handleSplashComplete}
      />
    );
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onNavigateToRegister={handleNavigateToRegister}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onNavigateToLogin={handleNavigateToLogin}
        onNavigateToSignUp={handleNavigateToSignUp}
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignUpScreen
        onNavigateToLogin={handleNavigateToLogin}
        onSignUpSuccess={handleSignUpSuccess}
      />
    );
  }

  if (currentScreen === 'deskPanel') {
    return (
      <DeskPanelScreen
        onNavigateBack={() => setCurrentScreen('main')}
      />
    );
  }

  if (currentScreen === 'projects') {
    return (
      <ProjectsScreen
        onNavigateBack={() => setCurrentScreen('main')}
      />
    );
  }

  // Main app screen
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => console.log('Dashboard pressed')}>
            {iconsLoaded ? (
              <Ionicons name="grid-outline" size={24} color="#2c3e50" />
            ) : (
              <Text style={[styles.fallbackIcon, { color: '#2c3e50' }]}>📊</Text>
            )}
          </TouchableOpacity>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon} onPress={() => console.log('Search pressed')}>
              {iconsLoaded ? (
                <Ionicons name="search-outline" size={24} color="#2c3e50" />
              ) : (
                <Text style={[styles.fallbackIcon, { color: '#2c3e50' }]}>🔍</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={() => console.log('Notifications pressed')}>
              {iconsLoaded ? (
                <Ionicons name="notifications-outline" size={24} color="#2c3e50" />
              ) : (
                <Text style={[styles.fallbackIcon, { color: '#2c3e50' }]}>🔔</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={handleLogout}>
              {iconsLoaded ? (
                <Ionicons name="log-out-outline" size={24} color="#2c3e50" />
              ) : (
                <Text style={[styles.fallbackIcon, { color: '#2c3e50' }]}>🚪</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {renderContent()}

      <View style={styles.bottomNav}>
        {bottomTabs.map(({ id, icon, activeIcon }) => (
          <TouchableOpacity
            key={id}
            style={styles.tabItem}
            onPress={() => handleTabPress(id)}
            activeOpacity={0.7}
          >
            {iconsLoaded ? (
              <Ionicons
                name={activeTab === id ? activeIcon : icon}
                size={24}
                color={activeTab === id ? '#2c3e50' : '#7f8c8d'}
              />
            ) : (
              <Text style={[styles.fallbackIcon, { color: activeTab === id ? '#2c3e50' : '#7f8c8d' }]}>
                {activeTab === id ? '●' : '○'}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
    width: '100%',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    padding: 8,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { 
    flex: 1, 
    padding: scale(20),
    width: '100%',
  },
  userInfo: {
    backgroundColor: '#ffffff',
    padding: scale(15),
    borderRadius: scale(10),
    marginBottom: scale(15),
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  welcomeText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: scale(5),
  },
  roleText: {
    fontSize: scale(14),
    color: '#7f8c8d',
  },
  menuGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingTop: scale(10),
    width: '100%',
  },
  menuItem: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: scale(20),
    borderRadius: scale(15),
    marginBottom: scale(15),
    alignItems: 'center',
    elevation: Platform.OS === 'android' ? 3 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minHeight: scale(120),
    justifyContent: 'center',
  },
  menuIcon: { 
    fontSize: scale(32), 
    marginBottom: scale(10) 
  },
  menuTitle: { 
    fontSize: scale(16), 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    marginBottom: scale(5), 
    textAlign: 'center' 
  },
  menuDescription: { 
    fontSize: scale(12), 
    color: '#7f8c8d', 
    textAlign: 'center', 
    lineHeight: scale(16) 
  },
  tabContent: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: scale(20) 
  },
  tabTitle: { 
    fontSize: scale(24), 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    marginBottom: scale(10) 
  },
  tabSubtitle: { 
    fontSize: scale(16), 
    color: '#7f8c8d', 
    textAlign: 'center' 
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    minHeight: 60,
  },
  tabItem: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 8, 
    paddingHorizontal: 16,
    minWidth: 60,
  },
  fallbackIcon: { 
    fontSize: scale(20), 
    fontWeight: 'bold' 
  },
});

export default App;
