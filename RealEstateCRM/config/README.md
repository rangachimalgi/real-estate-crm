# API Configuration

This directory contains the API configuration for the Real Estate CRM app.

## Configuration File: `api.ts`

The `api.ts` file contains centralized API configuration including:

- **Production URL**: `https://real-estate-crm-backend-yfxi.onrender.com`
- **Development URL**: `http://10.0.2.2:8000` (for local development)
- **API Endpoints**: Centralized endpoint definitions
- **Helper Functions**: `buildApiUrl()` and `apiRequest()` for making API calls

## Switching Between Environments

### For Production (Deployed Backend)
The app is currently configured to use the production backend by default.

### For Local Development
To switch to local development, edit `config/api.ts` and change:

```typescript
get API_BASE_URL() {
  return this.BASE_URL; // Production
  // return this.DEV_BASE_URL; // Development
}
```

## Usage in Components

```typescript
import { buildApiUrl, API_CONFIG } from './config/api';

// Make API calls
const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username, password }),
});
```

## Available Endpoints

- `LOGIN`: `/auth/login`
- `REGISTER`: `/auth/register`
- `LOGOUT`: `/auth/logout`
- `USER_PROFILE`: `/auth/profile`

## Backend URL

Production backend is deployed at: https://real-estate-crm-backend-yfxi.onrender.com 