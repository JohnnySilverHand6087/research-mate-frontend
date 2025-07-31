import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CreateDocumentModal } from './create-document-modal';
import { useDocuments, useDeleteDocument } from '@/hooks/useDocuments';
import { Document, DocumentType } from '@/types/api';
import { 
  Plus, 
  Search, 
  FileText, 
  Link as LinkIcon, 
  File, 
  Newspaper,
  ExternalLink,
  Download,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

interface ProjectDocumentsProps {
  projectId: string;
}

export const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ projectId }) => {
  const { data: documents = [], isLoading } = useDocuments(projectId);
  const deleteDocument = useDeleteDocument();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.PAPER:
        return <FileText className="h-5 w-5" />;
      case DocumentType.ARTICLE:
        return <Newspaper className="h-5 w-5" />;
      case DocumentType.LINK:
        return <LinkIcon className="h-5 w-5" />;
      case DocumentType.FILE:
        return <File className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getDocumentTypeColor = (type: DocumentType) => {
    switch (type) {
      case DocumentType.PAPER:
        return 'bg-primary text-primary-foreground';
      case DocumentType.ARTICLE:
        return 'bg-secondary text-secondary-foreground';
      case DocumentType.LINK:
        return 'bg-accent text-accent-foreground';
      case DocumentType.FILE:
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleDelete = async (document: Document) => {
    if (window.confirm(`Are you sure you want to remove "${document.title}"?`)) {
      await deleteDocument.mutateAsync({ id: document.id, projectId });
    }
  };

  const handleDocumentClick = (document: Document) => {
    if (document.url) {
      window.open(document.url, '_blank');
    } else if (document.file_path) {
      // Handle file download
      console.log('Download file:', document.file_path);
    }
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
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Project Documents</h2>
          <Badge variant="outline">{documents.length} documents</Badge>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          {searchQuery ? (
            <div>
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground">No documents found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div>
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No documents yet</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Document
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="group hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {getDocumentIcon(document.type)}
                    <Badge 
                      className={`text-xs ${getDocumentTypeColor(document.type)}`}
                      variant="secondary"
                    >
                      {document.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(document);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <CardTitle className="text-sm line-clamp-2">{document.title}</CardTitle>
                {document.summary && (
                  <CardDescription className="line-clamp-3 text-xs">
                    {document.summary}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Tags */}
                  {document.tags && document.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {document.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {document.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{document.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(document.created_at), 'MMM d, yyyy')}
                    </span>
                    <div className="flex items-center gap-1">
                      {document.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDocumentClick(document)}
                          className="h-6 w-6 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      {document.file_path && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDocumentClick(document)}
                          className="h-6 w-6 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Document Modal */}
      <CreateDocumentModal
        projectId={projectId}
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};