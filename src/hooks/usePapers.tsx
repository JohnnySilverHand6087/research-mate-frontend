import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { papersApi } from '@/services/api';
import { Paper, CreatePaperRequest, CreateNoteRequest, ChatMessage } from '@/types/papers';
import { toast } from '@/hooks/use-toast';

export const usePapers = () => {
  return useQuery({
    queryKey: ['papers'],
    queryFn: () => papersApi.getPapers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePaper = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paper: CreatePaperRequest) => papersApi.createPaper(paper),
    onSuccess: (newPaper: Paper) => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      toast({
        title: 'Paper added',
        description: `"${newPaper.title}" has been added to your library.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add paper',
        variant: 'destructive',
      });
    },
  });
};

export const useDeletePaper = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => papersApi.deletePaper(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      toast({
        title: 'Paper removed',
        description: 'Paper has been removed from your library.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove paper',
        variant: 'destructive',
      });
    },
  });
};

export const useAddNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (note: CreateNoteRequest) => papersApi.addNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      toast({
        title: 'Note added',
        description: 'Your note has been saved.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add note',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (noteId: string) => papersApi.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
      toast({
        title: 'Note deleted',
        description: 'Your note has been removed.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete note',
        variant: 'destructive',
      });
    },
  });
};

export const useChatWithPaper = () => {
  return useMutation({
    mutationFn: ({ paperId, message, conversationHistory }: { 
      paperId: string; 
      message: string; 
      conversationHistory: ChatMessage[] 
    }) => papersApi.chatWithPaper(paperId, message, conversationHistory),
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to get response',
        variant: 'destructive',
      });
    },
  });
};

export const useSearchPapers = () => {
  return useMutation({
    mutationFn: ({ query, count }: { query: string; count: number }) => 
      papersApi.searchPapers(query, count),
    onError: (error: any) => {
      toast({
        title: 'Search Error',
        description: error.message || 'Failed to search papers',
        variant: 'destructive',
      });
    },
  });
};

export const useSearchByDOI = () => {
  return useMutation({
    mutationFn: (doi: string) => papersApi.searchByDOI(doi),
    onError: (error: any) => {
      toast({
        title: 'DOI Search Error',
        description: error.message || 'Failed to find paper by DOI',
        variant: 'destructive',
      });
    },
  });
};