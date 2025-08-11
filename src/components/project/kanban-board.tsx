import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { TaskCard } from './task-card';
import { TaskModal } from './task-modal';
import { CreateTaskModal } from './create-task-modal';
import { useTasks, useMoveTask } from '@/hooks/useTasks';
import { Task, TaskStatus, TaskPriority, ProjectType } from '@/types/api';
import { Plus, Columns } from 'lucide-react';

interface KanbanBoardProps {
  projectId: string;
  projectType: ProjectType;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, projectType }) => {
  const { data: tasks = [], isLoading } = useTasks(projectId);
  const { moveTask } = useMoveTask();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState<TaskStatus>(TaskStatus.TODO);

  const columns = [
    { id: TaskStatus.TODO, title: 'To Do', color: 'bg-muted' },
    { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-accent' },
    { id: TaskStatus.REVIEW, title: 'Review', color: 'bg-secondary' },
    { id: TaskStatus.DONE, title: 'Done', color: 'bg-primary' },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      moveTask(draggedTask.id, status);
    }
    setDraggedTask(null);
  };

  const handleCreateTask = (status: TaskStatus) => {
    setCreateTaskStatus(status);
    setShowCreateModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Columns className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Task Board</h2>
        <Badge variant="outline">{tasks.length} tasks</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[600px]">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <Card
              key={column.id}
              className="flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    {column.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCreateTask(column.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 pt-0">
                <div className="space-y-3">
                  {columnTasks.length === 0 ? (
                    <div 
                      className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 text-center text-muted-foreground text-sm min-h-[100px] flex items-center justify-center"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, column.id)}
                    >
                      Drop tasks here or click + to add
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDragStart={handleDragStart}
                        onClick={() => setSelectedTask(task)}
                        isDragging={draggedTask?.id === task.id}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      <TaskModal
        task={selectedTask}
        open={!!selectedTask}
        onOpenChange={() => setSelectedTask(null)}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        projectId={projectId}
        projectType={projectType}
        defaultStatus={createTaskStatus}
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};