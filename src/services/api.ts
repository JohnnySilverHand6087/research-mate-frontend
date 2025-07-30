
import axios, { AxiosError } from 'axios';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  UpdateProfileRequest,
  Affiliation,
  CreateAffiliationRequest,
  UpdateAffiliationRequest,
  ApiError 
} from '@/types/api';

const API_BASE_URL = 'https://api.staging.researchmate.ai/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  getGoogleOAuthUrl(redirectUrl: string): string {
    return `${API_BASE_URL}/auth/oauth/google?redirect=${encodeURIComponent(redirectUrl)}`;
  },
};

// User API
export const userApi = {
  async getMe(): Promise<User> {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  async updateProfile(updates: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.patch('/users/me', updates);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.put('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Affiliations API
export const affiliationsApi = {
  async getAffiliations(): Promise<Affiliation[]> {
    const response = await apiClient.get('/users/me/affiliations');
    return response.data;
  },

  async createAffiliation(affiliation: CreateAffiliationRequest): Promise<Affiliation> {
    const response = await apiClient.post('/users/me/affiliations', affiliation);
    return response.data;
  },

  async updateAffiliation(id: string, updates: UpdateAffiliationRequest): Promise<Affiliation> {
    const response = await apiClient.patch(`/users/me/affiliations/${id}`, updates);
    return response.data;
  },

  async deleteAffiliation(id: string): Promise<void> {
    await apiClient.delete(`/users/me/affiliations/${id}`);
  },
};

// Error handling helper
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response?.data) {
    return error.response.data as ApiError;
  }
  return {
    message: error.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};
