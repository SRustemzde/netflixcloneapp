// API Configuration
const PRIMARY_API_URL = 'http://localhost:8000/api/v1';
const FALLBACK_API_URL = 'https://backend-fast-nmat.onrender.com/api/v1';
let API_BASE_URL = process.env.REACT_APP_API_URL || PRIMARY_API_URL;

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  
  // Content endpoints
  CONTENT: {
    MOVIES: '/content/movies',
    SERIES: '/content/series',
    SEARCH: '/content/search',
    TRENDING: '/content/trending',
    FEATURED: '/content/featured',
    BY_CATEGORY: '/content/category',
    BY_ID: '/content'
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    WATCHLIST: '/user/watchlist',
    WATCH_HISTORY: '/user/history',
    PREFERENCES: '/user/preferences'
  },
  
  // Video endpoints
  VIDEO: {
    STREAM: '/video/stream',
    METADATA: '/video/metadata',
    SUBTITLES: '/video/subtitles'
  }
};

// Function to make API request with fallback
const makeRequest = async (endpoint, options) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    // If primary API fails, try fallback
    if (API_BASE_URL === PRIMARY_API_URL) {
      console.warn(`Primary API failed, trying fallback: ${error.message}`);
      API_BASE_URL = FALLBACK_API_URL;
      
      try {
        const fallbackResponse = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!fallbackResponse.ok) {
          throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
        }
        
        return await fallbackResponse.json();
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        API_BASE_URL = PRIMARY_API_URL; // Reset for next request
        throw fallbackError;
      }
    }
    throw error;
  }
};

// HTTP client configuration
export const httpClient = {
  get: async (endpoint, options = {}) => {
    try {
      return await makeRequest(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        ...options
      });
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  },
  
  post: async (endpoint, data = {}, options = {}) => {
    try {
      return await makeRequest(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        body: JSON.stringify(data),
        ...options
      });
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  },
  
  put: async (endpoint, data = {}, options = {}) => {
    try {
      return await makeRequest(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        body: JSON.stringify(data),
        ...options
      });
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  },
  
  delete: async (endpoint, options = {}) => {
    try {
      return await makeRequest(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
          ...options.headers
        },
        ...options
      });
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }
};

// Helper function to get authentication headers
const getAuthHeaders = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.token) {
        return {
          'Authorization': `Bearer ${userData.token}`
        };
      }
    } catch (error) {
      console.error('Error parsing user data for auth headers:', error);
    }
  }
  return {};
};

// Request interceptor for handling common errors
export const handleApiError = (error) => {
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    localStorage.removeItem('user');
    window.location.href = '/login';
  } else if (error.message.includes('403')) {
    // Forbidden
    console.error('Access forbidden');
  } else if (error.message.includes('404')) {
    // Not found
    console.error('Resource not found');
  } else if (error.message.includes('500')) {
    // Server error
    console.error('Server error');
  }
  
  return error;
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  httpClient,
  handleApiError
};