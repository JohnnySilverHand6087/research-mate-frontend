
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { affiliationsApi, handleApiError } from '@/services/api';
import type { CreateAffiliationRequest, UpdateAffiliationRequest } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useAffiliations = () => {
  const queryClient = useQueryClient();

  const { data: affiliations, isLoading } = useQuery({
    queryKey: ['affiliations'],
    queryFn: affiliationsApi.getAffiliations,
  });

  const createMutation = useMutation({
    mutationFn: affiliationsApi.createAffiliation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliations'] });
      toast({
        title: 'Affiliation Added',
        description: 'Your affiliation has been added successfully.',
      });
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast({
        title: 'Creation Failed',
        description: apiError.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateAffiliationRequest }) =>
      affiliationsApi.updateAffiliation(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliations'] });
      toast({
        title: 'Affiliation Updated',
        description: 'Your affiliation has been updated successfully.',
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

  const deleteMutation = useMutation({
    mutationFn: affiliationsApi.deleteAffiliation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliations'] });
      toast({
        title: 'Affiliation Deleted',
        description: 'Your affiliation has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      const apiError = handleApiError(error);
      toast({
        title: 'Deletion Failed',
        description: apiError.message,
        variant: 'destructive',
      });
    },
  });

  return {
    affiliations: affiliations || [],
    isLoading,
    createAffiliation: createMutation.mutateAsync,
    updateAffiliation: (id: string, updates: UpdateAffiliationRequest) =>
      updateMutation.mutateAsync({ id, updates }),
    deleteAffiliation: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
