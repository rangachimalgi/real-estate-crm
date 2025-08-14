import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

// Using Ionicons from react-native-vector-icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import SignUpScreen from './SignUpScreen';
import SplashScreen from './SplashScreen';
import DeskPanelScreen from './DeskPanelScreen';
import ProjectsScreen from './ProjectsScreen';
import ChatListScreen from './ChatListScreen';
import ChatScreen from './ChatScreen';
import VideoCallScreen from './VideoCallScreen';

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive breakpoints
const isSmallDevice = screenWidth < 375;
const isMediumDevice = screenWidth >= 375 && screenWidth < 768;
const isLargeDevice = screenWidth >= 768;
const isLargeScreen = screenHeight > 800; // 6.5 inches and above

// Navigation types
type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  SignUp: undefined;
};

type MainStackParamList = {
  Home: undefined;
  DeskPanel: undefined;
  Projects: undefined;
  ChatList: undefined;
  Chat: { customerId?: string; customerName?: string };
  VideoCall: { customerId?: string; customerName?: string };
};

type TabParamList = {
  HomeTab: undefined;
  ChatTab: undefined;
  SettingsTab: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Auth Navigator
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// Main Stack Navigator
function MainNavigator({ onLogout }: { onLogout: () => Promise<void> }) {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <MainStack.Screen name="Home">
        {() => <TabNavigator onLogout={onLogout} />}
      </MainStack.Screen>
      <MainStack.Screen name="DeskPanel" component={DeskPanelScreen} />
      <MainStack.Screen name="Projects" component={ProjectsScreen} />
      <MainStack.Screen name="ChatList" component={ChatListScreen} />
      <MainStack.Screen name="Chat" component={ChatScreen} />
      <MainStack.Screen name="VideoCall" component={VideoCallScreen} />
    </MainStack.Navigator>
  );
}

// Tab Navigator
function TabNavigator({ onLogout }: { onLogout: () => Promise<void> }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ChatTab') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2c3e50',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0.5,
          borderTopColor: '#e0e0e0',
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 34 : 16,
          height: isLargeScreen ? 80 : 60,
        },
        tabBarLabelStyle: {
          fontSize: isLargeScreen ? 12 : 10,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        options={{ tabBarLabel: 'Home' }}
      >
        {() => <HomeScreen onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen 
        name="ChatTab" 
        component={ChatListScreen}
        options={{ tabBarLabel: 'Chat' }}
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

// Home Screen Component
function HomeScreen({ onLogout }: { onLogout: () => Promise<void> }) {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [allowedScreens, setAllowedScreens] = useState<string[]>([]);
  const [iconsLoaded, setIconsLoaded] = useState(false);

  useEffect(() => {
    // Check if icons are working
    try {
      const testIcon = Ionicons.getImageSource('home', 24, '#000');
      setIconsLoaded(true);
    } catch (error) {
      console.log('Icons not loaded properly:', error);
    }
    
    loadUserData();
  }, []);

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

  const handleMenuPress = (option: typeof menuOptions[number]) => {
    console.log(`Pressed: ${option.title}`);
    
    // Handle navigation based on menu option
    switch (option.key) {
      case 'DeskPanel':
        (navigation as any).navigate('DeskPanel');
        break;
      case 'Projects':
        (navigation as any).navigate('Projects');
        break;
      default:
        console.log(`Navigation to ${option.key} not implemented yet`);
    }
  };

  const handleLogout = async () => {
    console.log('🔄 Logout button pressed');
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            console.log('🔄 User confirmed logout');
            try {
              console.log('🔄 Clearing local state...');
              setAllowedScreens([]);
              setUser(null);
              console.log('🔄 Calling onLogout function...');
              await onLogout();
              console.log('🔄 Logout completed');
            } catch (error) {
              console.error('❌ Logout error:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
}

// Chat Tab Screen Component
function ChatTabScreen() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Chat</Text>
      <Text style={styles.tabSubtitle}>Manage conversations</Text>
    </View>
  );
}

// Settings Screen Component
function SettingsScreen() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Settings</Text>
      <Text style={styles.tabSubtitle}>Configure your preferences</Text>
    </View>
  );
}

// Main App Component
function App(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Splash' | 'Auth' | 'Main'>('Splash');
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setInitialRoute('Main');
      } else {
        setInitialRoute('Auth');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setInitialRoute('Auth');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log('🔄 Main App handleLogout called');
    try {
      console.log('🔄 Clearing AsyncStorage...');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('screens');
      console.log('🔄 AsyncStorage cleared successfully');
      
      console.log('🔄 Navigating to Auth screen');
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
      console.log('🔄 Navigation reset completed');
    } catch (error) {
      console.error('❌ Main App logout error:', error);
    }
  };

  if (isLoading) {
    return <SplashScreen onSplashComplete={() => setInitialRoute('Auth')} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="Splash">
            {() => <SplashScreen onSplashComplete={() => setInitialRoute('Auth')} />}
          </Stack.Screen>
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="Main">
            {() => <MainNavigator onLogout={handleLogout} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
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
    paddingBottom: isLargeScreen ? 16 : 12,
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
    minWidth: isLargeScreen ? 48 : 44,
    minHeight: isLargeScreen ? 48 : 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { 
    flex: 1, 
    padding: isLargeScreen ? 24 : 20,
    width: '100%',
  },
  userInfo: {
    backgroundColor: '#ffffff',
    padding: isLargeScreen ? 20 : 15,
    borderRadius: isLargeScreen ? 12 : 10,
    marginBottom: isLargeScreen ? 20 : 15,
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  welcomeText: {
    fontSize: isLargeScreen ? 20 : 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: isLargeScreen ? 8 : 5,
  },
  roleText: {
    fontSize: isLargeScreen ? 16 : 14,
    color: '#7f8c8d',
  },
  menuGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingTop: isLargeScreen ? 12 : 10,
    width: '100%',
  },
  menuItem: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: isLargeScreen ? 24 : 20,
    borderRadius: isLargeScreen ? 18 : 15,
    marginBottom: isLargeScreen ? 20 : 15,
    alignItems: 'center',
    elevation: Platform.OS === 'android' ? 3 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minHeight: isLargeScreen ? 140 : 120,
    justifyContent: 'center',
  },
  menuIcon: { 
    fontSize: isLargeScreen ? 36 : 32, 
    marginBottom: isLargeScreen ? 12 : 10 
  },
  menuTitle: { 
    fontSize: isLargeScreen ? 18 : 16, 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    marginBottom: isLargeScreen ? 6 : 5, 
    textAlign: 'center' 
  },
  menuDescription: { 
    fontSize: isLargeScreen ? 14 : 12, 
    color: '#7f8c8d', 
    textAlign: 'center', 
    lineHeight: isLargeScreen ? 18 : 16 
  },
  tabContent: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: isLargeScreen ? 24 : 20 
  },
  tabTitle: { 
    fontSize: isLargeScreen ? 28 : 24, 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    marginBottom: isLargeScreen ? 12 : 10 
  },
  tabSubtitle: { 
    fontSize: isLargeScreen ? 18 : 16, 
    color: '#7f8c8d', 
    textAlign: 'center' 
  },
  fallbackIcon: { 
    fontSize: isLargeScreen ? 22 : 20, 
    fontWeight: 'bold' 
  },
});

export default App;
