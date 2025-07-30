
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

// Use dummy data for development
const USE_DUMMY_DATA = true;

// Dummy data
const dummyUser: User = {
  id: '1',
  email: 'user@example.com',
  full_name: 'John Doe',
  display_name: 'John',
  bio: 'Researcher at University of Example',
  website: 'https://johndoe.example.com',
  orcid_id: '0000-0000-0000-0000',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  social_links: { twitter: '@johndoe', linkedin: 'johndoe' },
  primary_affiliation: 'University of Example',
  is_verified: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const dummyAffiliations: Affiliation[] = [
  {
    id: '1',
    institution: 'University of Example',
    department: 'Computer Science',
    position_title: 'Assistant Professor',
    position_type: 'faculty' as any,
    start_date: '2020-09-01',
    end_date: undefined,
    is_primary: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    institution: 'Tech Corp',
    department: 'Research Division',
    position_title: 'Senior Researcher',
    position_type: 'industry' as any,
    start_date: '2018-06-01',
    end_date: '2020-08-31',
    is_primary: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

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
    if (error.response?.status === 401 && !USE_DUMMY_DATA) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        access_token: 'dummy-token',
        token_type: 'Bearer',
        expires_in: 3600,
        user: dummyUser,
      };
    }
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        access_token: 'dummy-token',
        token_type: 'Bearer',
        expires_in: 3600,
        user: { ...dummyUser, email: userData.email, full_name: userData.full_name },
      };
    }
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
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return dummyUser;
    }
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  async updateProfile(updates: UpdateProfileRequest): Promise<User> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { ...dummyUser, ...updates };
    }
    const response = await apiClient.patch('/users/me', updates);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<User> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { ...dummyUser, avatar_url: URL.createObjectURL(file) };
    }
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
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return dummyAffiliations;
    }
    const response = await apiClient.get('/users/me/affiliations');
    return response.data;
  },

  async createAffiliation(affiliation: CreateAffiliationRequest): Promise<Affiliation> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newAffiliation: Affiliation = {
        id: String(Date.now()),
        ...affiliation,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dummyAffiliations.push(newAffiliation);
      return newAffiliation;
    }
    const response = await apiClient.post('/users/me/affiliations', affiliation);
    return response.data;
  },

  async updateAffiliation(id: string, updates: UpdateAffiliationRequest): Promise<Affiliation> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = dummyAffiliations.findIndex(a => a.id === id);
      if (index >= 0) {
        dummyAffiliations[index] = { ...dummyAffiliations[index], ...updates, updated_at: new Date().toISOString() };
        return dummyAffiliations[index];
      }
      throw new Error('Affiliation not found');
    }
    const response = await apiClient.patch(`/users/me/affiliations/${id}`, updates);
    return response.data;
  },

  async deleteAffiliation(id: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = dummyAffiliations.findIndex(a => a.id === id);
      if (index >= 0) {
        dummyAffiliations.splice(index, 1);
      }
      return;
    }
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
