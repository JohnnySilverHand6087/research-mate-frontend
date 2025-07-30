
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, handleApiError } from '@/services/api';
import type { UpdateProfileRequest } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user', 'me'], updatedUser);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast({
        title: 'Update Failed',
        description: apiError.message,
        variant: 'destructive',
      });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user', 'me'], updatedUser);
      toast({
        title: 'Avatar Updated',
        description: 'Your avatar has been updated successfully.',
      });
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast({
        title: 'Upload Failed',
        description: apiError.message,
        variant: 'destructive',
      });
    },
  });

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
  };
};
