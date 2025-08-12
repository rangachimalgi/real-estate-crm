// API Configuration
export const API_CONFIG = {
  // Production backend URL
  PRODUCTION_URL: 'https://real-estate-crm-backend-yfxi.onrender.com',
  
  // Development backend URLs for different platforms
  DEV_BASE_URL_ANDROID: 'http://10.0.2.2:8000', // Android emulator
  DEV_BASE_URL_IOS: 'http://localhost:8000', // iOS simulator
  DEV_BASE_URL_DEVICE: 'http://192.168.29.174:8000', // Physical device
  
  // Current API base URL (will be set automatically)
  currentBaseUrl: '',
  
  // Get current API base URL
  get API_BASE_URL() {
    return this.currentBaseUrl || this.PRODUCTION_URL;
  },
  
  // API endpoints
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    USER_PROFILE: '/auth/profile',
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.API_BASE_URL;
  return `${baseUrl}${endpoint}`;
};

// Helper function for API requests with automatic retry
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Initialize if not already done
  await initializeApi();
  
  const url = buildApiUrl(endpoint);
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Add timeout for Render free tier cold starts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // If localhost fails, try production as fallback
    if (API_CONFIG.currentBaseUrl !== API_CONFIG.PRODUCTION_URL) {
      console.log('🔄 Localhost failed, trying production backend...');
      API_CONFIG.currentBaseUrl = API_CONFIG.PRODUCTION_URL;
      return apiRequest(endpoint, options); // Retry with production
    }
    
    throw error;
  }
};

// Easy toggle function to switch between environments
export const switchToLocalhost = () => {
  API_CONFIG.currentBaseUrl = API_CONFIG.DEV_BASE_URL_ANDROID;
  console.log('🌐 Switched to localhost backend');
};

export const switchToProduction = () => {
  API_CONFIG.currentBaseUrl = API_CONFIG.PRODUCTION_URL;
  console.log('🌐 Switched to production backend');
};

// Smart API URL detection
const detectApiUrl = async (): Promise<string> => {
  // Try localhost first (for development)
  const localhostUrls = [
    API_CONFIG.DEV_BASE_URL_ANDROID,
    API_CONFIG.DEV_BASE_URL_IOS,
    API_CONFIG.DEV_BASE_URL_DEVICE
  ];

  for (const url of localhostUrls) {
    try {
      console.log(`🔍 Testing localhost URL: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${url}/`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log(`✅ Localhost backend found at: ${url}`);
        return url;
      }
    } catch (error) {
      console.log(`❌ Localhost backend not available at: ${url}`);
    }
  }

  console.log('🌐 Falling back to production backend');
  return API_CONFIG.PRODUCTION_URL;
};

// Initialize API URL automatically
let isInitialized = false;
export const initializeApi = async () => {
  if (!isInitialized) {
    console.log('🚀 Initializing API configuration...');
    API_CONFIG.currentBaseUrl = await detectApiUrl();
    isInitialized = true;
    console.log(`🌐 Using API URL: ${API_CONFIG.currentBaseUrl}`);
  }
  return API_CONFIG.currentBaseUrl;
};

// Auto-initialize on import
initializeApi().catch(console.error); 