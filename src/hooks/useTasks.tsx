import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/services/api';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => tasksApi.getTasks(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (task: CreateTaskRequest) => tasksApi.createTask(task),
    onSuccess: (newTask: Task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', newTask.project_id] });
      toast({
        title: 'Task created',
        description: `"${newTask.title}" has been added to the project.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create task',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskRequest }) =>
      tasksApi.updateTask(id, updates),
    onSuccess: (updatedTask: Task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.project_id] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update task',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) => tasksApi.deleteTask(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
      toast({
        title: 'Task deleted',
        description: 'Task has been removed from the project.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete task',
        variant: 'destructive',
      });
    },
  });
};

export const useMoveTask = () => {
  const updateTask = useUpdateTask();
  
  return {
    moveTask: (taskId: string, newStatus: TaskStatus, updates?: Partial<UpdateTaskRequest>) => {
      updateTask.mutate({
        id: taskId,
        updates: { status: newStatus, ...updates }
      });
    },
    isLoading: updateTask.isPending
  };
};