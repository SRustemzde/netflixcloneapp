// src/services/api.js

const API_BASE_URL = `https://backend-fast-s1z9.onrender.com/api/v1`;

// Mock watchlist data for fallback when backend is not running
let mockWatchlist = JSON.parse(localStorage.getItem('mockWatchlist') || '[]');

// Token'ı localStorage'dan almak için bir fonksiyon
const getToken = () => {
  return localStorage.getItem("authToken"); // Token'ı 'authToken' anahtarıyla sakladığımızı varsayalım
};

const request = async (
  endpoint,
  method = "GET",
  body = null,
  requiresAuth = false
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      // Token yoksa ve auth gerekiyorsa, isteği yapmadan hata verebilir veya login'e yönlendirebiliriz.
      // Şimdilik basitçe bir uyarı verelim. Gerçek uygulamada bu daha iyi yönetilmeli.
      console.warn(`Auth token is missing for request to ${endpoint}`);
      // throw new Error('Authentication token is missing.'); // Veya bir hata fırlat
    }
  }

  const config = {
    method: method,
    headers: headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('Making request to:', fullUrl);
    console.log('Request config:', config);
    
    const response = await fetch(fullUrl, config);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      // HTTP hata durumlarını yakala
      const errorData = await response
        .json()
        .catch(() => ({ detail: response.statusText }));
      console.log('Error response data:', errorData);
      const error = new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Eğer response body'si yoksa (örn: 204 No Content) null dön
    if (response.status === 204) {
      return null;
    }

    const jsonData = await response.json(); // Başarılı yanıtı JSON olarak parse et
    console.log('Response JSON:', jsonData);
    return jsonData;
  } catch (error) {
    console.error(`API call failed: ${method} ${endpoint}`, error);
    throw error; // Hataları tekrar fırlat ki component'ler yakalayabilsin
  }
};

// API servis fonksiyonları
const apiService = {
  // Auth - use real backend API only
  login: async (credentials) => {
    console.log('🔐 Calling real API for login...');
    
    // Create form data for OAuth2PasswordRequestForm
    const formData = new FormData();
    formData.append('username', credentials.email); // OAuth2 uses 'username' field for email
    formData.append('password', credentials.password);
    
    const config = {
      method: 'POST',
      body: formData
    };
    
    const fullUrl = `${API_BASE_URL}/auth/login`;
    console.log('Making login request to:', fullUrl);
    
    const response = await fetch(fullUrl, config);
    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      console.log('Login error response data:', errorData);
      const error = new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    
    const jsonData = await response.json();
    console.log('✅ Real login API response:', jsonData);
    return { data: { token: jsonData.access_token, token_type: jsonData.token_type } };
  },
  
  register: async (userData) => {
    console.log('📝 Calling real API for register...');
    
    // Transform frontend data to match backend schema
    const backendData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      first_name: userData.firstName || userData.name?.split(' ')[0] || '',
      last_name: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || ''
    };
    
    console.log('Transformed registration data:', backendData);
    const response = await request("/auth/register", "POST", backendData);
    console.log('✅ Real register API response:', response);
    return response;
  },
  getCurrentUser: () => request("/users/me/profile", "GET", null, true),
  updateUserProfile: (profileData) => request("/users/me/profile", "PUT", profileData, true),
  changePassword: (passwordData) => request("/users/me/password", "PUT", passwordData, true),

  // Content - use real backend API only
  getAllContent: async (params = {}) => {
    console.log('🎬 getAllContent called with params:', params);
    const queryParams = new URLSearchParams(params).toString();
    const url = `/content/${queryParams ? `?${queryParams}` : ''}`;
    console.log('📡 Calling real API URL:', `${API_BASE_URL}${url}`);
    
    const response = await request(url, "GET");
    console.log('✅ Real API response received:', response);
    return { success: true, data: response };
  },
  getContentById: async (contentId) => {
    const response = await request(`/content/${contentId}`, "GET");
    return { success: true, data: response };
  },
  getContentBySource: (sourceName, sourceId) =>
    request(`/content/source/${sourceName}/${sourceId}`, "GET"),
  searchContent: (query) =>
    request(`/content?q=${encodeURIComponent(query)}`, "GET"),

  // Categories
  getCategories: () => request("/categories", "GET"),
  getCategoryContents: (categoryName, params = {}) => {
    const queryParams = new URLSearchParams({
      ...params,
      category: categoryName,
    }).toString();
    return request(`/content?${queryParams}`, "GET");
  },

  // Watchlist - use local storage for now (authentication not required)
  getWatchlist: async () => {
    console.log('📋 Getting watchlist from localStorage...');
    // Get mock data from localStorage
    const mockWatchlist = JSON.parse(localStorage.getItem('mockWatchlist') || '[]');
    console.log('📋 Mock watchlist items:', mockWatchlist.length);
    
    // Return mock data in the expected format for MyList component
    return mockWatchlist.map(item => ({
      id: `mock_${item.id}`,
      content: {
        id: item.id,
        title: item.title,
        description: item.description,
        cover_image_url: item.cover_image_url,
        video_url: item.video_url,
        duration: item.duration,
        rating: item.rating,
        release_date: item.release_date,
        content_type: item.content_type,
        starring: item.starring,
        tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(', ') : [])
      },
      added_at: item.added_at || new Date().toISOString()
    }));
  },
  
  addToWatchlist: async (contentId) => {
    console.log('🎬 Adding to watchlist:', contentId);
    
    try {
      // Get current mock watchlist
      const currentWatchlist = JSON.parse(localStorage.getItem('mockWatchlist') || '[]');
      
      // Check if already in watchlist
      const alreadyExists = currentWatchlist.some(item => item.id === contentId);
      if (alreadyExists) {
        console.log('⚠️ Content already in watchlist');
        return { success: true, message: 'Already in watchlist' };
      }
      
      // Get content details from real API
      const contentResponse = await apiService.getContentById(contentId);
      console.log('🔍 Found content:', contentResponse);
      
      if (contentResponse.success && contentResponse.data) {
        const content = contentResponse.data;
        const watchlistItem = {
          id: content.id,
          title: content.title,
          description: content.description,
          cover_image_url: content.cover_image_url,
          video_url: content.video_url,
          duration: content.duration,
          rating: content.rating,
          release_date: content.release_date,
          content_type: content.content_type,
          starring: content.starring,
          tags: content.tags,
          added_at: new Date().toISOString()
        };
        
        currentWatchlist.push(watchlistItem);
        localStorage.setItem('mockWatchlist', JSON.stringify(currentWatchlist));
        console.log('✅ Added to mock watchlist successfully');
        return { success: true };
      } else {
        console.log('❌ Content not found');
        return { success: false, error: 'Content not found' };
      }
    } catch (e) {
      console.error('❌ Error adding to mock watchlist:', e);
      return { success: false, error: e.message };
    }
  },
  
  removeFromWatchlist: async (contentId) => {
    console.log('🗑️ Removing from watchlist:', contentId);
    // Get current mock watchlist
    const currentWatchlist = JSON.parse(localStorage.getItem('mockWatchlist') || '[]');
    const filteredWatchlist = currentWatchlist.filter(item => item.id !== contentId);
    localStorage.setItem('mockWatchlist', JSON.stringify(filteredWatchlist));
    console.log('✅ Removed from mock watchlist successfully');
    return { success: true };
  },

  // Watch History
  getWatchHistory: () => request("/users/me/watch-history", "GET", null, true),
  updateWatchHistory: (contentId, progress) =>
    request(
      "/users/me/watch-history",
      "POST",
      { content_id: contentId, progress_percentage: progress },
      true
    ),
  removeFromWatchHistory: (contentId) =>
    request(`/users/me/watch-history/${contentId}`, "DELETE", null, true),

  // User Profile & Settings
  updateUserPreferences: (preferencesData) =>
    request("/users/me/preferences", "PUT", preferencesData, true),

  // Diğer endpoint'ler buraya eklenebilir
};

export default apiService;
