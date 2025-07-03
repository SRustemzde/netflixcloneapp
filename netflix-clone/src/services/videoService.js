import { httpClient, API_ENDPOINTS, handleApiError } from '../config/api';

class VideoService {
  // Get video stream URL
  async getStreamUrl(contentId, quality = 'auto') {
    try {
      const queryParams = new URLSearchParams({
        quality
      });
      
      const response = await httpClient.get(`${API_ENDPOINTS.VIDEO.STREAM}/${contentId}?${queryParams}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get video metadata
  async getVideoMetadata(contentId) {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.VIDEO.METADATA}/${contentId}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get video subtitles
  async getSubtitles(contentId, language = 'en') {
    try {
      const queryParams = new URLSearchParams({
        language
      });
      
      const response = await httpClient.get(`${API_ENDPOINTS.VIDEO.SUBTITLES}/${contentId}?${queryParams}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Update watch progress
  async updateWatchProgress(contentId, currentTime, duration) {
    try {
      const response = await httpClient.post(`${API_ENDPOINTS.VIDEO.STREAM}/${contentId}/progress`, {
        current_time: currentTime,
        duration: duration,
        progress_percentage: (currentTime / duration) * 100,
        updated_at: new Date().toISOString()
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get watch progress
  async getWatchProgress(contentId) {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.VIDEO.STREAM}/${contentId}/progress`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Generate video thumbnail
  async generateThumbnail(contentId, timestamp) {
    try {
      const response = await httpClient.post(`${API_ENDPOINTS.VIDEO.METADATA}/${contentId}/thumbnail`, {
        timestamp
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get available video qualities
  async getAvailableQualities(contentId) {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.VIDEO.STREAM}/${contentId}/qualities`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get available audio tracks
  async getAudioTracks(contentId) {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.VIDEO.STREAM}/${contentId}/audio`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Report playback error
  async reportPlaybackError(contentId, errorData) {
    try {
      const response = await httpClient.post(`${API_ENDPOINTS.VIDEO.STREAM}/${contentId}/error`, {
        error_type: errorData.type,
        error_message: errorData.message,
        error_code: errorData.code,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        ...errorData
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Get video analytics
  async getVideoAnalytics(contentId, timeRange = '7d') {
    try {
      const queryParams = new URLSearchParams({
        time_range: timeRange
      });
      
      const response = await httpClient.get(`${API_ENDPOINTS.VIDEO.METADATA}/${contentId}/analytics?${queryParams}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Validate video access
  async validateAccess(contentId) {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.VIDEO.STREAM}/${contentId}/validate`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // Create watch session
  async createWatchSession(contentId) {
    try {
      const response = await httpClient.post(`${API_ENDPOINTS.VIDEO.STREAM}/${contentId}/session`, {
        started_at: new Date().toISOString(),
        device_info: {
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          platform: navigator.platform
        }
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  // End watch session
  async endWatchSession(sessionId, watchTime) {
    try {
      const response = await httpClient.put(`${API_ENDPOINTS.VIDEO.STREAM}/session/${sessionId}`, {
        ended_at: new Date().toISOString(),
        total_watch_time: watchTime
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
}

export default new VideoService();