
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { useAffiliations } from '@/hooks/useAffiliations';
import { affiliationSchema, type AffiliationFormData } from '@/schema/affiliation';
import { PositionType } from '@/types/api';
import { toast } from '@/hooks/use-toast';

const POSITION_TYPE_OPTIONS = [
  { value: PositionType.FACULTY, label: 'Faculty' },
  { value: PositionType.POSTDOC, label: 'Postdoc' },
  { value: PositionType.GRADUATE_STUDENT, label: 'Graduate Student' },
  { value: PositionType.UNDERGRADUATE_STUDENT, label: 'Undergraduate Student' },
  { value: PositionType.RESEARCH_SCIENTIST, label: 'Research Scientist' },
  { value: PositionType.INDUSTRY, label: 'Industry' },
  { value: PositionType.OTHER, label: 'Other' },
];

export const AffiliationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { affiliations, createAffiliation, updateAffiliation, isCreating, isUpdating } = useAffiliations();
  
  const isEditing = Boolean(id);
  const existingAffiliation = isEditing ? affiliations.find(a => a.id === id) : null;
  const primaryAffiliationExists = affiliations.some(a => a.is_primary && a.id !== id);

  const form = useForm<AffiliationFormData>({
    resolver: zodResolver(affiliationSchema),
    defaultValues: {
      institution: existingAffiliation?.institution || '',
      department: existingAffiliation?.department || '',
      position_title: existingAffiliation?.position_title || '',
      position_type: existingAffiliation?.position_type || PositionType.OTHER,
      start_date: existingAffiliation?.start_date || '',
      end_date: existingAffiliation?.end_date || '',
      is_primary: existingAffiliation?.is_primary || false,
    },
  });

  const onSubmit = async (data: AffiliationFormData) => {
    try {
      // Check if trying to set as primary when another primary exists
      if (data.is_primary && primaryAffiliationExists && !existingAffiliation?.is_primary) {
        const confirmChange = window.confirm(
          'Setting this as primary will remove the primary status from your current primary affiliation. Continue?'
        );
        if (!confirmChange) return;
      }

      if (isEditing && id) {
        await updateAffiliation(id, data);
      } else {
        await createAffiliation(data);
      }
      navigate('/profile/affiliations');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <ProtectedLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile/affiliations')}
            className="hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Affiliations
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {isEditing ? 'Edit Affiliation' : 'Add Affiliation'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update your affiliation details' : 'Add a new institutional affiliation'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle>Affiliation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="University of Research"
                          className="bg-input/50 border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department/School</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Department of Computer Science"
                          className="bg-input/50 border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="position_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position Title</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Assistant Professor"
                            className="bg-input/50 border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-input/50 border-border">
                              <SelectValue placeholder="Select position type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-border">
                            {POSITION_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date"
                            className="bg-input/50 border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date"
                            className="bg-input/50 border-border"
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Leave empty if current position
                        </p>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="is_primary"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 bg-muted/20">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-medium">
                          Set as Primary Affiliation
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Your primary affiliation will be displayed prominently on your profile.
                          {primaryAffiliationExists && !existingAffiliation?.is_primary && (
                            <span className="block text-amber-600 mt-1">
                              Note: You already have a primary affiliation. Setting this as primary will replace it.
                            </span>
                          )}
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-6">
                  <Button 
                    type="submit" 
                    className="metallic-btn flex-1"
                    disabled={isCreating || isUpdating}
                  >
                    {(isCreating || isUpdating) ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        {isEditing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? 'Update Affiliation' : 'Create Affiliation'}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/profile/affiliations')}
                    className="bg-muted/50 hover:bg-muted"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
};
