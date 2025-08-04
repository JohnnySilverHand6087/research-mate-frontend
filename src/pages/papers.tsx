import React, { useState } from 'react';
import { Search, Plus, Filter, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePapers } from '@/hooks/usePapers';
import { Paper, PaperCategory } from '@/types/papers';
import { CreatePaperModal } from '@/components/papers/create-paper-modal';
import { PaperChatInterface } from '@/components/papers/paper-chat-interface';
import { PaperViewer } from '@/components/papers/paper-viewer';
import { PaperSearch } from '@/components/papers/paper-search';

const categoryLabels: Record<PaperCategory, string> = {
  [PaperCategory.MACHINE_LEARNING]: 'Machine Learning',
  [PaperCategory.ARTIFICIAL_INTELLIGENCE]: 'AI',
  [PaperCategory.COMPUTER_VISION]: 'Computer Vision',
  [PaperCategory.NATURAL_LANGUAGE_PROCESSING]: 'NLP',
  [PaperCategory.ROBOTICS]: 'Robotics',
  [PaperCategory.DATA_SCIENCE]: 'Data Science',
  [PaperCategory.BIOINFORMATICS]: 'Bioinformatics',
  [PaperCategory.CYBERSECURITY]: 'Cybersecurity',
  [PaperCategory.SOFTWARE_ENGINEERING]: 'Software Engineering',
  [PaperCategory.HUMAN_COMPUTER_INTERACTION]: 'HCI',
  [PaperCategory.OTHER]: 'Other',
};

const categoryColors: Record<PaperCategory, string> = {
  [PaperCategory.MACHINE_LEARNING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [PaperCategory.ARTIFICIAL_INTELLIGENCE]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [PaperCategory.COMPUTER_VISION]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [PaperCategory.NATURAL_LANGUAGE_PROCESSING]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [PaperCategory.ROBOTICS]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [PaperCategory.DATA_SCIENCE]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  [PaperCategory.BIOINFORMATICS]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  [PaperCategory.CYBERSECURITY]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [PaperCategory.SOFTWARE_ENGINEERING]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  [PaperCategory.HUMAN_COMPUTER_INTERACTION]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  [PaperCategory.OTHER]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export const PapersPage: React.FC = () => {
  const { data: papers, isLoading } = usePapers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const filteredPapers = papers?.filter(paper => {
    const matchesSearch = 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handlePaperClick = (paper: Paper) => {
    setSelectedPaper(paper);
    if (paper.pdf_url) {
      setViewerOpen(true);
    } else {
      setChatOpen(true);
    }
  };

  const handleChatWithPaper = (paper: Paper) => {
    setSelectedPaper(paper);
    setChatOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Research Papers</h1>
          <p className="text-muted-foreground mt-2">
            Manage and interact with your research paper collection
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSearchModalOpen(true)}>
            <Search className="h-4 w-4 mr-2" />
            Search Papers
          </Button>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Paper
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search papers by title, author, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Papers Grid */}
      {filteredPapers && filteredPapers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {paper.title}
                  </CardTitle>
                  <Badge className={categoryColors[paper.category]}>
                    {categoryLabels[paper.category]}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {paper.authors.join(', ')}
                </CardDescription>
                {paper.journal && (
                  <p className="text-xs text-muted-foreground">
                    {paper.journal} • {new Date(paper.publication_date).getFullYear()}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {paper.abstract}
                </p>
                
                {/* Tags */}
                {paper.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {paper.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {paper.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{paper.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleChatWithPaper(paper)}
                    className="flex-1"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  {paper.pdf_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePaperClick(paper)}
                      className="flex-1"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View PDF
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery || selectedCategory !== 'all' ? 'No papers found' : 'No papers yet'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Add your first research paper to get started'}
          </p>
        </div>
      )}

      {/* Modals */}
      <CreatePaperModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      
      <PaperSearch
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
      />

      {selectedPaper && (
        <>
          <PaperChatInterface
            paper={selectedPaper}
            open={chatOpen}
            onOpenChange={setChatOpen}
          />
          
          {selectedPaper.pdf_url && (
            <PaperViewer
              paper={selectedPaper}
              open={viewerOpen}
              onOpenChange={setViewerOpen}
            />
          )}
        </>
      )}
    </div>
  );
};