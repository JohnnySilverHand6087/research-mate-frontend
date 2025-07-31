import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '@/services/api';
import { Document, CreateDocumentRequest } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useDocuments = (projectId: string) => {
  return useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => documentsApi.getDocuments(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (document: CreateDocumentRequest) => documentsApi.createDocument(document),
    onSuccess: (newDocument: Document) => {
      queryClient.invalidateQueries({ queryKey: ['documents', newDocument.project_id] });
      toast({
        title: 'Document added',
        description: `"${newDocument.title}" has been added to the project.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add document',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) => documentsApi.deleteDocument(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.projectId] });
      toast({
        title: 'Document removed',
        description: 'Document has been removed from the project.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove document',
        variant: 'destructive',
      });
    },
  });
};