import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Mock API functions for PDF annotations
const mockSaveAnnotations = async (annotationData: any): Promise<any> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock saving to localStorage for demo
  const existing = JSON.parse(localStorage.getItem('pdf-annotations') || '[]');
  const newAnnotation = {
    id: Date.now().toString(),
    ...annotationData,
    savedAt: new Date().toISOString()
  };
  
  existing.push(newAnnotation);
  localStorage.setItem('pdf-annotations', JSON.stringify(existing));
  
  return newAnnotation;
};

const mockGetAnnotations = async (paperId: string): Promise<any[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const all = JSON.parse(localStorage.getItem('pdf-annotations') || '[]');
  return all.filter((annotation: any) => annotation.paperId === paperId);
};

const mockDeleteAnnotation = async (annotationId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existing = JSON.parse(localStorage.getItem('pdf-annotations') || '[]');
  const filtered = existing.filter((annotation: any) => annotation.id !== annotationId);
  localStorage.setItem('pdf-annotations', JSON.stringify(filtered));
};

const mockSaveAnnotatedPdf = async (paperId: string, pdfData: Blob): Promise<string> => {
  // Simulate uploading annotated PDF
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would upload to a cloud service
  // For demo, we'll just return a mock URL
  const mockUrl = `https://example.com/annotated-pdfs/${paperId}-${Date.now()}.pdf`;
  
  // Store metadata in localStorage
  const metadata = {
    paperId,
    url: mockUrl,
    size: pdfData.size,
    savedAt: new Date().toISOString()
  };
  
  const existing = JSON.parse(localStorage.getItem('annotated-pdfs') || '[]');
  existing.push(metadata);
  localStorage.setItem('annotated-pdfs', JSON.stringify(existing));
  
  return mockUrl;
};

// Hooks
export const useSaveAnnotations = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockSaveAnnotations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdf-annotations'] });
      toast.success('Annotations saved successfully!');
    },
    onError: (error) => {
      console.error('Error saving annotations:', error);
      toast.error('Failed to save annotations');
    },
  });
};

export const useGetAnnotations = (paperId: string) => {
  return useQuery({
    queryKey: ['pdf-annotations', paperId],
    queryFn: () => mockGetAnnotations(paperId),
    enabled: !!paperId,
  });
};

export const useDeleteAnnotation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mockDeleteAnnotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdf-annotations'] });
      toast.success('Annotation deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting annotation:', error);
      toast.error('Failed to delete annotation');
    },
  });
};

export const useSaveAnnotatedPdf = () => {
  return useMutation({
    mutationFn: ({ paperId, pdfData }: { paperId: string; pdfData: Blob }) => 
      mockSaveAnnotatedPdf(paperId, pdfData),
    onSuccess: (url) => {
      toast.success('Annotated PDF saved successfully!');
    },
    onError: (error) => {
      console.error('Error saving annotated PDF:', error);
      toast.error('Failed to save annotated PDF');
    },
  });
};