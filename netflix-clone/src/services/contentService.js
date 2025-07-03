import { httpClient, API_ENDPOINTS, handleApiError } from '../config/api';

class ContentService {
  // Get all movies
  async getMovies(page = 1, limit = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await httpClient.get(`${API_ENDPOINTS.CONTENT.MOVIES}?${queryParams}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get all series
  async getSeries(page = 1, limit = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters
      });
      
      const response = await httpClient.get(`${API_ENDPOINTS.CONTENT.SERIES}?${queryParams}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get content by ID
  async getContentById(id) {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.CONTENT.BY_ID}/${id}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Search content
  async searchContent(query, type = 'all', page = 1, limit = 20) {
    try {
      const queryParams = new URLSearchParams({
        q: query,
        type,
        page,
        limit
      });
      
      const response = await httpClient.get(`${API_ENDPOINTS.CONTENT.SEARCH}?${queryParams}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get trending content
  async getTrendingContent(timeWindow = 'week', type = 'all') {
    try {
      const queryParams = new URLSearchParams({
        time_window: timeWindow,
        type
      });
      
      const response = await httpClient.get(`${API_ENDPOINTS.CONTENT.TRENDING}?${queryParams}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get featured content
  async getFeaturedContent() {
    try {
      const response = await httpClient.get(API_ENDPOINTS.CONTENT.FEATURED);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get content by category
  async getContentByCategory(categoryId, page = 1, limit = 20) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit
      });
      
      const response = await httpClient.get(`${API_ENDPOINTS.CONTENT.BY_CATEGORY}/${categoryId}?${queryParams}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Add to watchlist
  async addToWatchlist(contentId) {
    try {
      const response = await httpClient.post(API_ENDPOINTS.USER.WATCHLIST, {
        content_id: contentId
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Remove from watchlist
  async removeFromWatchlist(contentId) {
    try {
      const response = await httpClient.delete(`${API_ENDPOINTS.USER.WATCHLIST}/${contentId}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get user's watchlist
  async getWatchlist(page = 1, limit = 20) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit
      });
      
      const response = await httpClient.get(`${API_ENDPOINTS.USER.WATCHLIST}?${queryParams}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Add to watch history
  async addToWatchHistory(contentId, watchTime = 0, duration = 0) {
    try {
      const response = await httpClient.post(API_ENDPOINTS.USER.WATCH_HISTORY, {
        content_id: contentId,
        watch_time: watchTime,
        duration: duration,
        watched_at: new Date().toISOString()
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get watch history
  async getWatchHistory(page = 1, limit = 20) {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit
      });
      
      const response = await httpClient.get(`${API_ENDPOINTS.USER.WATCH_HISTORY}?${queryParams}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Rate content
  async rateContent(contentId, rating) {
    try {
      const response = await httpClient.post(`${API_ENDPOINTS.CONTENT.BY_ID}/${contentId}/rate`, {
        rating
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

export default new ContentService();