// API Configuration
export const API_CONFIG = {
  // Production backend URL
  BASE_URL: 'https://real-estate-crm-backend-yfxi.onrender.com',
  
  // Development backend URL (for local testing)
  DEV_BASE_URL: 'http://10.0.2.2:8000',
  
  // Current API base URL (can be changed dynamically)
  currentBaseUrl: 'https://real-estate-crm-backend-yfxi.onrender.com',
  
  // Get current API base URL
  get API_BASE_URL() {
    return this.currentBaseUrl;
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
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};

// Helper function for API requests
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
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
    throw error;
  }
};

// Easy toggle function to switch between environments
export const switchToLocalhost = () => {
  API_CONFIG.currentBaseUrl = API_CONFIG.DEV_BASE_URL;
  console.log('🌐 Switched to localhost backend');
};

export const switchToProduction = () => {
  API_CONFIG.currentBaseUrl = API_CONFIG.BASE_URL;
  console.log('🌐 Switched to production backend');
};

// Initialize with production by default
API_CONFIG.currentBaseUrl = API_CONFIG.BASE_URL; 