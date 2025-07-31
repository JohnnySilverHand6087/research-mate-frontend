import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUpdateTask, useDeleteTask } from '@/hooks/useTasks';
import { Task, TaskStatus, TaskPriority, UpdateTaskRequest } from '@/types/api';
import { Calendar, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
});

interface TaskModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  open,
  onOpenChange,
}) => {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [isEditing, setIsEditing] = React.useState(false);

  const form = useForm<UpdateTaskRequest>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || TaskStatus.TODO,
      priority: task?.priority || TaskPriority.MEDIUM,
    },
  });

  React.useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
      });
      setIsEditing(false);
    }
  }, [task, form]);

  const onSubmit = async (data: UpdateTaskRequest) => {
    if (!task) return;
    
    try {
      await updateTask.mutateAsync({ id: task.id, updates: data });
      setIsEditing(false);
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask.mutateAsync({ id: task.id, projectId: task.project_id });
        onOpenChange(false);
      } catch (error) {
        // Error handled by mutation hook
      }
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-muted text-muted-foreground';
      case TaskStatus.IN_PROGRESS:
        return 'bg-accent text-accent-foreground';
      case TaskStatus.REVIEW:
        return 'bg-secondary text-secondary-foreground';
      case TaskStatus.DONE:
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return 'bg-destructive text-destructive-foreground';
      case TaskPriority.HIGH:
        return 'bg-accent text-accent-foreground';
      case TaskPriority.MEDIUM:
        return 'bg-secondary text-secondary-foreground';
      case TaskPriority.LOW:
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Task Details</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Created {format(new Date(task.created_at), 'MMMM d, yyyy')}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                          <SelectItem value={TaskStatus.REVIEW}>Review</SelectItem>
                          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                          <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                          <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                          <SelectItem value={TaskPriority.URGENT}>Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateTask.isPending}
                  className="flex-1"
                >
                  {updateTask.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
              {task.description && (
                <p className="text-muted-foreground">{task.description}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge className={getStatusColor(task.status)}>
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Priority:</span>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {format(new Date(task.created_at), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated: {format(new Date(task.updated_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};