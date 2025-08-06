import React, { useState } from 'react';
import { ExternalLink, MessageSquare, Plus, X, StickyNote } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAddNote, useDeleteNote } from '@/hooks/usePapers';
import { Paper, PaperNote } from '@/types/papers';

interface PaperViewerProps {
  paper: Paper;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaperViewer: React.FC<PaperViewerProps> = ({
  paper,
  open,
  onOpenChange,
}) => {
  const [newNote, setNewNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const addNote = useAddNote();
  const deleteNote = useDeleteNote();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await addNote.mutateAsync({
        paper_id: paper.id,
        content: newNote,
      });
      setNewNote('');
      setShowAddNote(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote.mutateAsync(noteId);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const openPdfInNewTab = () => {
    if (paper.pdf_url) {
      window.open(paper.pdf_url, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="line-clamp-2">{paper.title}</DialogTitle>
          <DialogDescription>
            View and annotate research paper
          </DialogDescription>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex flex-wrap gap-2">
              {paper.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <Button size="sm" variant="outline" onClick={openPdfInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* PDF Viewer */}
          <div className="flex-1 bg-muted/20 rounded-lg overflow-hidden">
            {paper.pdf_url ? (
              <iframe
                src={`${paper.pdf_url}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border-0"
                title={`PDF: ${paper.title}`}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <StickyNote className="h-16 w-16 mx-auto mb-4" />
                  <p>No PDF available for this paper</p>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="w-80 flex flex-col">
            <Tabs defaultValue="info" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="flex-1 mt-4 overflow-hidden">
                <ScrollArea className="h-full max-h-[calc(90vh-200px)]">
                  <div className="space-y-6 pr-4">
                    {/* Authors Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <h4 className="font-semibold text-sm">Authors</h4>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm leading-relaxed">{paper.authors.join(', ')}</p>
                      </div>
                    </div>

                    <Separator />
                    
                    {/* Publication Details */}
                    <div className="grid gap-4">
                      {paper.journal && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Journal</h4>
                          <p className="text-sm bg-muted/30 rounded-md px-3 py-2">{paper.journal}</p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Publication Date</h4>
                        <p className="text-sm bg-muted/30 rounded-md px-3 py-2">
                          {new Date(paper.publication_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      
                      {paper.doi && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">DOI</h4>
                          <div className="bg-muted/30 rounded-md px-3 py-2">
                            <p className="text-sm font-mono break-all">{paper.doi}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />
                    
                    {/* Abstract Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <h4 className="font-semibold text-sm">Abstract</h4>
                      </div>
                      <div className="bg-gradient-to-br from-muted/40 to-muted/60 rounded-lg p-4 border border-border/50">
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {paper.abstract}
                        </p>
                      </div>
                    </div>

                    {/* Tags Section */}
                    {paper.tags.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <h4 className="font-semibold text-sm">Tags</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {paper.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="secondary" 
                                className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="notes" className="flex-1 mt-4 overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Notes</h3>
                    <Button
                      size="sm"
                      onClick={() => setShowAddNote(!showAddNote)}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Note
                    </Button>
                  </div>

                  {showAddNote && (
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <Textarea
                          placeholder="Add your note here..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="mb-3"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleAddNote}
                            disabled={!newNote.trim() || addNote.isPending}
                          >
                            {addNote.isPending ? 'Saving...' : 'Save Note'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowAddNote(false);
                              setNewNote('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {paper.notes.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No notes yet</p>
                        <p className="text-xs">Add your first note to get started</p>
                      </div>
                    ) : (
                      paper.notes.map((note) => (
                        <Card key={note.id}>
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm flex-1">{note.content}</p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteNote(note.id)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(note.created_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};