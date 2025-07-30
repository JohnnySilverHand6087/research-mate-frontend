
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Mail, Globe, ExternalLink, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { useAuth } from '@/hooks/useAuth';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <ProtectedLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your research profile and settings</p>
          </div>
          <Button asChild className="metallic-btn">
            <Link to="/profile/edit">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-2 border-primary/20">
                <AvatarImage src={user.avatar_url} alt={user.display_name || user.full_name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {user.display_name?.[0] || user.full_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    {user.display_name || user.full_name}
                  </h2>
                  {user.is_verified && (
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </div>

                {user.primary_affiliation && (
                  <div className="flex items-center text-muted-foreground">
                    <Building className="w-4 h-4 mr-2" />
                    {user.primary_affiliation}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Bio */}
            {user.bio && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Bio</h3>
                <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              {user.website && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Website</h3>
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-bright-cyan transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {user.website}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}

              {user.orcid_id && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">ORCID ID</h3>
                  <a
                    href={`https://orcid.org/${user.orcid_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-bright-cyan transition-colors"
                  >
                    <span className="w-4 h-4 mr-2 font-bold">⚬</span>
                    {user.orcid_id}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            {user.social_links && Object.keys(user.social_links).length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Social Links</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(user.social_links).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                    >
                      <span className="capitalize font-medium mr-2">{platform}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="glass-effect border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
            <Link to="/profile/edit" className="block">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Edit Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your personal information and bio
                    </p>
                  </div>
                  <Edit className="w-5 h-5 text-primary" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="glass-effect border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
            <Link to="/profile/affiliations" className="block">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Manage Affiliations</h3>
                    <p className="text-sm text-muted-foreground">
                      Add and manage your institutional affiliations
                    </p>
                  </div>
                  <Building className="w-5 h-5 text-primary" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
};
