import React from 'react';
import { useParams, Link, useLocation, Navigate } from 'react-router-dom';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProject } from '@/hooks/useProjects';
import { ProjectDashboard } from '@/components/project/project-dashboard';
import { KanbanBoard } from '@/components/project/kanban-board';
import { ProjectDocuments } from '@/components/project/project-documents';
import { ArrowLeft, BarChart3, Kanban, FileText } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { data: project, isLoading, error } = useProject(id!);

  // Determine active tab from URL
  const pathSegments = location.pathname.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  let activeTab = 'dashboard';
  
  if (lastSegment === 'kanban') activeTab = 'kanban';
  else if (lastSegment === 'documents') activeTab = 'documents';

  if (!id) {
    return <Navigate to="/projects" replace />;
  }

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </ProtectedLayout>
    );
  }

  if (error || !project) {
    return (
      <ProtectedLayout>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Project not found</p>
          <Link to="/projects">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </ProtectedLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary text-primary-foreground';
      case 'completed':
        return 'bg-secondary text-secondary-foreground';
      case 'archived':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link to="/projects">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            {project.description && (
              <p className="text-muted-foreground max-w-2xl">{project.description}</p>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard" asChild>
              <Link to={`/projects/${id}`} className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Link>
            </TabsTrigger>
            <TabsTrigger value="kanban" asChild>
              <Link to={`/projects/${id}/kanban`} className="flex items-center gap-2">
                <Kanban className="h-4 w-4" />
                Kanban
              </Link>
            </TabsTrigger>
            <TabsTrigger value="documents" asChild>
              <Link to={`/projects/${id}/documents`} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <ProjectDashboard project={project} />
          </TabsContent>

          <TabsContent value="kanban" className="mt-6">
            <KanbanBoard projectId={project.id} />
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <ProjectDocuments projectId={project.id} />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
};