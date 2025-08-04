import React, { useState } from 'react';
import { Search, Hash, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchPapers, useSearchByDOI, useCreatePaper } from '@/hooks/usePapers';
import { PaperCategory } from '@/types/papers';
import { toast } from '@/hooks/use-toast';

interface SearchResult {
  title: string;
  authors: string[];
  abstract: string;
  publication_date: string;
  journal?: string;
  doi?: string;
  pdf_url?: string;
}

interface PaperSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export const PaperSearch: React.FC<PaperSearchProps> = ({ open, onOpenChange }) => {
  const [internetQuery, setInternetQuery] = useState('');
  const [paperCount, setPaperCount] = useState('5');
  const [doiQuery, setDoiQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<SearchResult | null>(null);
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PaperCategory>(PaperCategory.OTHER);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const searchPapers = useSearchPapers();
  const searchByDOI = useSearchByDOI();
  const createPaper = useCreatePaper();

  const handleInternetSearch = async () => {
    if (!internetQuery.trim()) return;
    
    try {
      const results = await searchPapers.mutateAsync({
        query: internetQuery,
        count: parseInt(paperCount)
      });
      setSearchResults(results as SearchResult[]);
    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'Failed to search for papers. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleArxivSearch = async () => {
    if (!internetQuery.trim()) return;
    
    try {
      const results = await searchPapers.mutateAsync({
        query: `arxiv:${internetQuery}`,
        count: parseInt(paperCount)
      });
      setSearchResults(results as SearchResult[]);
    } catch (error) {
      toast({
        title: 'arXiv Search Failed',
        description: 'Failed to search arXiv papers. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSemanticSearch = async () => {
    if (!internetQuery.trim()) return;
    
    try {
      const results = await searchPapers.mutateAsync({
        query: `semantic:${internetQuery}`,
        count: parseInt(paperCount)
      });
      setSearchResults(results as SearchResult[]);
    } catch (error) {
      toast({
        title: 'Semantic Scholar Search Failed',
        description: 'Failed to search Semantic Scholar. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDOISearch = async () => {
    if (!doiQuery.trim()) return;
    
    try {
      const result = await searchByDOI.mutateAsync(doiQuery);
      setSearchResults([result as SearchResult]);
    } catch (error) {
      toast({
        title: 'DOI Search Failed',
        description: 'Failed to find paper with the provided DOI.',
        variant: 'destructive',
      });
    }
  };

  const handleAddToCollection = (paper: SearchResult) => {
    setSelectedPaper(paper);
    setAddToCollectionOpen(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSavePaper = async () => {
    if (!selectedPaper) return;

    try {
      await createPaper.mutateAsync({
        title: selectedPaper.title,
        authors: selectedPaper.authors,
        abstract: selectedPaper.abstract,
        category: selectedCategory,
        publication_date: selectedPaper.publication_date,
        journal: selectedPaper.journal,
        doi: selectedPaper.doi,
        pdf_url: selectedPaper.pdf_url,
        tags: selectedTags,
      });
      
      setAddToCollectionOpen(false);
      setSelectedPaper(null);
      setSelectedTags([]);
      setSelectedCategory(PaperCategory.OTHER);
      
      toast({
        title: 'Paper Added',
        description: 'Paper has been added to your collection.',
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save paper to collection.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Search for Papers</DialogTitle>
            <DialogDescription>
              Search for research papers from the internet or by DOI
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="internet" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="internet">Internet</TabsTrigger>
              <TabsTrigger value="arxiv">arXiv</TabsTrigger>
              <TabsTrigger value="semantic">Semantic Scholar</TabsTrigger>
              <TabsTrigger value="doi">DOI</TabsTrigger>
            </TabsList>

            <TabsContent value="internet" className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter search query..."
                    value={internetQuery}
                    onChange={(e) => setInternetQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInternetSearch()}
                  />
                </div>
                <Select value={paperCount} onValueChange={setPaperCount}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleInternetSearch}
                  disabled={searchPapers.isPending || !internetQuery.trim()}
                >
                  {searchPapers.isPending ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="arxiv" className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search arXiv papers..."
                    value={internetQuery}
                    onChange={(e) => setInternetQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleArxivSearch()}
                  />
                </div>
                <Select value={paperCount} onValueChange={setPaperCount}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleArxivSearch}
                  disabled={searchPapers.isPending || !internetQuery.trim()}
                >
                  {searchPapers.isPending ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search arXiv
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="semantic" className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search Semantic Scholar..."
                    value={internetQuery}
                    onChange={(e) => setInternetQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch()}
                  />
                </div>
                <Select value={paperCount} onValueChange={setPaperCount}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleSemanticSearch}
                  disabled={searchPapers.isPending || !internetQuery.trim()}
                >
                  {searchPapers.isPending ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search Semantic
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="doi" className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter DOI (e.g., 10.1000/xyz123)"
                    value={doiQuery}
                    onChange={(e) => setDoiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleDOISearch()}
                  />
                </div>
                <Button 
                  onClick={handleDOISearch}
                  disabled={searchByDOI.isPending || !doiQuery.trim()}
                >
                  {searchByDOI.isPending ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Hash className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Search Results</h3>
                <div className="grid gap-4">
                  {searchResults.map((paper, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg leading-tight">
                          {paper.title}
                        </CardTitle>
                        <CardDescription>
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
                        <div className="flex justify-between items-center">
                          {paper.doi && (
                            <p className="text-xs text-muted-foreground">
                              DOI: {paper.doi}
                            </p>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleAddToCollection(paper)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Collection
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add to Collection Modal */}
      <Dialog open={addToCollectionOpen} onOpenChange={setAddToCollectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
            <DialogDescription>
              Select category and tags for "{selectedPaper?.title}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={selectedCategory} 
                onValueChange={(value) => setSelectedCategory(value as PaperCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button size="sm" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setAddToCollectionOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSavePaper}
                disabled={createPaper.isPending}
              >
                {createPaper.isPending ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                Save to Collection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};