// API Configuration
export const API_CONFIG = {
  // Production backend URL
  BASE_URL: 'https://real-estate-crm-backend-yfxi.onrender.com',
  
  // Development backend URL (for local testing)
  DEV_BASE_URL: 'http://10.0.2.2:8000',
  
  // Use production by default, change to DEV_BASE_URL for local development
  get API_BASE_URL() {
    return this.BASE_URL;
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

  return fetch(url, config);
}; 