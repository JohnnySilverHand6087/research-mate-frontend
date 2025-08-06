import { apiClient, handleApiError } from './api';
import { 
  ApiSettings, 
  CreateApiSettingsRequest, 
  UpdateApiSettingsRequest,
  AIProvider,
  EmbeddingProvider,
  PaperProvider
} from '@/types/settings';

// Dummy data for development
const DUMMY_API_SETTINGS: ApiSettings = {
  id: '1',
  userId: 'user-1',
  chatConfig: {
    provider: AIProvider.OPENAI,
    apiKey: 'sk-dummy-openai-key',
    model: 'gpt-4.1-2025-04-14',
    temperature: 0.7,
    maxTokens: 4000
  },
  embeddingConfig: {
    provider: EmbeddingProvider.OPENAI,
    apiKey: 'sk-dummy-openai-key',
    model: 'text-embedding-3-large',
    dimensions: 1536
  },
  paperConfigs: [
    {
      provider: PaperProvider.ARXIV,
      enabled: true
    },
    {
      provider: PaperProvider.SEMANTIC_SCHOLAR,
      enabled: true
    },
    {
      provider: PaperProvider.PUBMED,
      apiKey: 'dummy-pubmed-key',
      enabled: false
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const settingsApi = {
  // Get user's API settings
  async getApiSettings(): Promise<ApiSettings> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/api/settings');
      // return response.data;
      
      // Return dummy data for now
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_API_SETTINGS), 500);
      });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new API settings
  async createApiSettings(settings: CreateApiSettingsRequest): Promise<ApiSettings> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.post('/api/settings', settings);
      // return response.data;
      
      // Return dummy data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const newSettings: ApiSettings = {
            ...DUMMY_API_SETTINGS,
            id: Math.random().toString(36).substr(2, 9),
            chatConfig: {
              ...settings.chatConfig,
              provider: settings.chatConfig.provider as AIProvider
            },
            embeddingConfig: {
              ...settings.embeddingConfig,
              provider: settings.embeddingConfig.provider as EmbeddingProvider
            },
            paperConfigs: settings.paperConfigs.map(config => ({
              ...config,
              provider: config.provider as PaperProvider
            })),
            updatedAt: new Date().toISOString()
          };
          resolve(newSettings);
        }, 800);
      });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update existing API settings
  async updateApiSettings(settings: UpdateApiSettingsRequest): Promise<ApiSettings> {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.put('/api/settings', settings);
      // return response.data;
      
      // Return dummy data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedSettings: ApiSettings = {
            ...DUMMY_API_SETTINGS,
            ...settings,
            chatConfig: settings.chatConfig ? {
              ...settings.chatConfig,
              provider: settings.chatConfig.provider as AIProvider
            } : DUMMY_API_SETTINGS.chatConfig,
            embeddingConfig: settings.embeddingConfig ? {
              ...settings.embeddingConfig,
              provider: settings.embeddingConfig.provider as EmbeddingProvider
            } : DUMMY_API_SETTINGS.embeddingConfig,
            paperConfigs: settings.paperConfigs ? 
              settings.paperConfigs.map(config => ({
                ...config,
                provider: config.provider as PaperProvider
              })) : DUMMY_API_SETTINGS.paperConfigs,
            updatedAt: new Date().toISOString()
          };
          resolve(updatedSettings);
        }, 600);
      });
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Test API connection
  async testApiConnection(provider: AIProvider | EmbeddingProvider, apiKey: string, model: string): Promise<{ success: boolean; message: string }> {
    try {
      // TODO: Replace with actual API test calls
      // const response = await apiClient.post('/api/settings/test', { provider, apiKey, model });
      // return response.data;
      
      // Return dummy test result for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const isValidKey = apiKey.length > 10 && apiKey.startsWith('sk-');
          resolve({
            success: isValidKey,
            message: isValidKey ? 'Connection successful!' : 'Invalid API key format'
          });
        }, 1000);
      });
    } catch (error) {
      throw handleApiError(error);
    }
  }
};