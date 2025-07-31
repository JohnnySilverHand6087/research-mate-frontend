import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task, TaskPriority } from '@/types/api';
import { Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onClick: () => void;
  isDragging?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDragStart,
  onClick,
  isDragging = false,
}) => {
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

  const getPriorityIcon = (priority: TaskPriority) => {
    if (priority === TaskPriority.URGENT || priority === TaskPriority.HIGH) {
      return <AlertCircle className="h-3 w-3" />;
    }
    return null;
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={onClick}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium line-clamp-2 flex-1">
            {task.title}
          </h4>
          <div className="flex items-center gap-1">
            {getPriorityIcon(task.priority)}
            <Badge 
              className={`text-xs ${getPriorityColor(task.priority)}`}
              variant="secondary"
            >
              {task.priority}
            </Badge>
          </div>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(task.created_at), 'MMM d')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};