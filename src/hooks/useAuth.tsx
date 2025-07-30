
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, userApi, handleApiError } from '@/services/api';
import type { User, LoginRequest, RegisterRequest } from '@/types/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem('access_token')
  );
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: userApi.getMe,
    enabled: isAuthenticated,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false; // Don't retry on auth errors
      }
      return failureCount < 2;
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      setIsAuthenticated(true);
      queryClient.setQueryData(['user', 'me'], data.user);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast({
        title: 'Login Failed',
        description: apiError.message,
        variant: 'destructive',
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      setIsAuthenticated(true);
      queryClient.setQueryData(['user', 'me'], data.user);
      toast({
        title: 'Welcome to Research Mate!',
        description: 'Your account has been created successfully.',
      });
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast({
        title: 'Registration Failed',
        description: apiError.message,
        variant: 'destructive',
      });
    },
  });

  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: RegisterRequest) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    queryClient.clear();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  const refreshUser = async () => {
    await refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
