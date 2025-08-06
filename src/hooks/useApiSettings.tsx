import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/services/settingsApi';
import { CreateApiSettingsRequest, UpdateApiSettingsRequest, AIProvider, EmbeddingProvider } from '@/types/settings';
import { useToast } from '@/hooks/use-toast';

export const useApiSettings = () => {
  return useQuery({
    queryKey: ['apiSettings'],
    queryFn: settingsApi.getApiSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateApiSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: settingsApi.createApiSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiSettings'] });
      toast({
        title: 'Settings Created',
        description: 'Your API settings have been saved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create API settings.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateApiSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: settingsApi.updateApiSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiSettings'] });
      toast({
        title: 'Settings Updated',
        description: 'Your API settings have been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update API settings.',
        variant: 'destructive',
      });
    },
  });
};

export const useTestApiConnection = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ provider, apiKey, model }: { provider: AIProvider | EmbeddingProvider; apiKey: string; model: string }) =>
      settingsApi.testApiConnection(provider, apiKey, model),
    onSuccess: (data) => {
      toast({
        title: data.success ? 'Connection Successful' : 'Connection Failed',
        description: data.message,
        variant: data.success ? 'default' : 'destructive',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Test Failed',
        description: error.message || 'Failed to test API connection.',
        variant: 'destructive',
      });
    },
  });
};