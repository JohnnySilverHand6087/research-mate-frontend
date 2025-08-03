import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreatePaper } from '@/hooks/usePapers';
import { PaperCategory } from '@/types/papers';

const createPaperSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.array(z.string()).min(1, 'At least one author is required'),
  abstract: z.string().min(1, 'Abstract is required'),
  category: z.nativeEnum(PaperCategory),
  publication_date: z.string().min(1, 'Publication date is required'),
  journal: z.string().optional(),
  doi: z.string().optional(),
  pdf_url: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()),
});

type CreatePaperForm = z.infer<typeof createPaperSchema>;

interface CreatePaperModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryLabels: Record<PaperCategory, string> = {
  [PaperCategory.MACHINE_LEARNING]: 'Machine Learning',
  [PaperCategory.ARTIFICIAL_INTELLIGENCE]: 'Artificial Intelligence',
  [PaperCategory.COMPUTER_VISION]: 'Computer Vision',
  [PaperCategory.NATURAL_LANGUAGE_PROCESSING]: 'Natural Language Processing',
  [PaperCategory.ROBOTICS]: 'Robotics',
  [PaperCategory.DATA_SCIENCE]: 'Data Science',
  [PaperCategory.BIOINFORMATICS]: 'Bioinformatics',
  [PaperCategory.CYBERSECURITY]: 'Cybersecurity',
  [PaperCategory.SOFTWARE_ENGINEERING]: 'Software Engineering',
  [PaperCategory.HUMAN_COMPUTER_INTERACTION]: 'Human Computer Interaction',
  [PaperCategory.OTHER]: 'Other',
};

export const CreatePaperModal: React.FC<CreatePaperModalProps> = ({
  open,
  onOpenChange,
}) => {
  const createPaper = useCreatePaper();
  const [authorInput, setAuthorInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const form = useForm<CreatePaperForm>({
    resolver: zodResolver(createPaperSchema),
    defaultValues: {
      title: '',
      authors: [],
      abstract: '',
      category: PaperCategory.OTHER,
      publication_date: '',
      journal: '',
      doi: '',
      pdf_url: '',
      tags: [],
    },
  });

  const authors = form.watch('authors');
  const tags = form.watch('tags');

  const addAuthor = () => {
    if (authorInput.trim()) {
      const currentAuthors = form.getValues('authors');
      form.setValue('authors', [...currentAuthors, authorInput.trim()]);
      setAuthorInput('');
    }
  };

  const removeAuthor = (index: number) => {
    const currentAuthors = form.getValues('authors');
    form.setValue('authors', currentAuthors.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues('tags');
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue('tags', [...currentTags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  const handleAuthorInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAuthor();
    }
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (data: CreatePaperForm) => {
    try {
      await createPaper.mutateAsync({
        title: data.title,
        authors: data.authors,
        abstract: data.abstract,
        category: data.category,
        publication_date: data.publication_date,
        journal: data.journal,
        doi: data.doi,
        pdf_url: data.pdf_url || undefined,
        tags: data.tags,
      });
      form.reset();
      setAuthorInput('');
      setTagInput('');
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Research Paper</DialogTitle>
          <DialogDescription>
            Add a new research paper to your collection
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter paper title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Authors</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Author name"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  onKeyPress={handleAuthorInputKeyPress}
                />
                <Button type="button" onClick={addAuthor} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {authors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {authors.map((author, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {author}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeAuthor(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              {form.formState.errors.authors && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.authors.message}
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter paper abstract"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="publication_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="journal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Journal name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOI (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="10.xxxx/xxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pdf_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDF URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Tags</FormLabel>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Tag name"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(index)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPaper.isPending}>
                {createPaper.isPending ? 'Adding...' : 'Add Paper'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};