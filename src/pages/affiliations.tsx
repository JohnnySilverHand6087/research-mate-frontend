
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Building, Edit, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { useAffiliations } from '@/hooks/useAffiliations';
import { PositionType } from '@/types/api';
import { toast } from '@/hooks/use-toast';

const POSITION_TYPE_LABELS: Record<PositionType, string> = {
  [PositionType.FACULTY]: 'Faculty',
  [PositionType.POSTDOC]: 'Postdoc',
  [PositionType.GRADUATE_STUDENT]: 'Graduate Student',
  [PositionType.UNDERGRADUATE_STUDENT]: 'Undergraduate Student',
  [PositionType.RESEARCH_SCIENTIST]: 'Research Scientist',
  [PositionType.INDUSTRY]: 'Industry',
  [PositionType.OTHER]: 'Other',
};

export const AffiliationsPage: React.FC = () => {
  const { affiliations, isLoading, deleteAffiliation, isDeleting } = useAffiliations();

  const handleDeleteAffiliation = async (id: string, institution: string) => {
    if (window.confirm(`Are you sure you want to delete your affiliation with ${institution}?`)) {
      try {
        await deleteAffiliation(id);
      } catch (error) {
        // Error handling is done in the hook
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your affiliations...</p>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Affiliations</h1>
            <p className="text-muted-foreground">
              Manage your institutional affiliations and positions
            </p>
          </div>
          <Button asChild className="metallic-btn">
            <Link to="/profile/affiliations/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Affiliation
            </Link>
          </Button>
        </div>

        {/* Affiliations List */}
        {affiliations.length === 0 ? (
          <Card className="glass-effect border-border/50">
            <CardContent className="py-12 text-center">
              <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Affiliations Yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your institutional affiliations to showcase your research background.
              </p>
              <Button asChild className="metallic-btn">
                <Link to="/profile/affiliations/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Affiliation
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {affiliations.map((affiliation) => (
              <Card key={affiliation.id} className="glass-effect border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {affiliation.institution}
                        </h3>
                        {affiliation.is_primary && (
                          <Badge variant="secondary" className="bg-accent text-accent-foreground">
                            <Star className="w-3 h-3 mr-1" />
                            Primary
                          </Badge>
                        )}
                      </div>

                      {affiliation.department && (
                        <p className="text-muted-foreground mb-1">
                          {affiliation.department}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {affiliation.position_title && (
                          <span>{affiliation.position_title}</span>
                        )}
                        
                        <Badge variant="outline" className="text-xs">
                          {POSITION_TYPE_LABELS[affiliation.position_type]}
                        </Badge>

                        <span>
                          {formatDate(affiliation.start_date)} - {formatDate(affiliation.end_date)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="hover:bg-muted/50"
                      >
                        <Link to={`/profile/affiliations/${affiliation.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAffiliation(affiliation.id, affiliation.institution)}
                        disabled={isDeleting}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        {isDeleting ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
};
