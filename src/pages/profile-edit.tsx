
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, ArrowLeft, Plus, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AvatarUpload } from '@/components/ui/avatar-upload';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { profileSchema, type ProfileFormData } from '@/schema/profile';

export const ProfileEditPage: React.FC = () => {
  const { user } = useAuth();
  const { updateProfile, uploadAvatar, isUpdatingProfile, isUploadingAvatar } = useProfile();
  const navigate = useNavigate();
  const [socialLinks, setSocialLinks] = React.useState<Record<string, string>>(
    user?.social_links || {}
  );
  const [researchExpertise, setResearchExpertise] = React.useState<string[]>(
    user?.research_expertise || []
  );

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: user?.display_name || '',
      bio: user?.bio || '',
      website: user?.website || '',
      orcid_id: user?.orcid_id || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        ...data,
        social_links: socialLinks,
        research_expertise: researchExpertise,
      });
      navigate('/profile');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleAvatarUpload = async (file: File) => {
    await uploadAvatar(file);
  };

  const addSocialLink = () => {
    const platform = prompt('Enter platform name (e.g., twitter, linkedin):');
    const url = prompt('Enter URL:');
    
    if (platform && url) {
      setSocialLinks(prev => ({
        ...prev,
        [platform.toLowerCase()]: url,
      }));
    }
  };

  const removeSocialLink = (platform: string) => {
    setSocialLinks(prev => {
      const updated = { ...prev };
      delete updated[platform];
      return updated;
    });
  };

  const addExpertiseArea = () => {
    const area = prompt('Enter research expertise area:');
    if (area && !researchExpertise.includes(area)) {
      setResearchExpertise(prev => [...prev, area]);
    }
  };

  const removeExpertiseArea = (area: string) => {
    setResearchExpertise(prev => prev.filter(item => item !== area));
  };

  if (!user) return null;

  return (
    <ProtectedLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
            <p className="text-muted-foreground">Update your profile information</p>
          </div>
        </div>

        {/* Avatar Section */}
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <AvatarUpload
                currentAvatarUrl={user.avatar_url}
                onUpload={handleAvatarUpload}
                isUploading={isUploadingAvatar}
                size="lg"
              />
              <div>
                <h3 className="font-medium text-foreground">Upload a new avatar</h3>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="How you'd like to be displayed"
                          className="bg-input/50 border-border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Tell us about yourself and your research interests..."
                          rows={4}
                          className="bg-input/50 border-border resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="url"
                            placeholder="https://your-website.com"
                            className="bg-input/50 border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orcid_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ORCID ID</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="0000-0000-0000-0000"
                            className="bg-input/50 border-border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Research Expertise */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-foreground">Research Expertise</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addExpertiseArea}
                      className="bg-muted/50 hover:bg-muted"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Area
                    </Button>
                  </div>
                  
                  {researchExpertise.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {researchExpertise.map((area, index) => (
                        <div key={index} className="flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-md">
                          <Tag className="w-3 h-3" />
                          <span className="text-sm">{area}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExpertiseArea(area)}
                            className="h-auto p-0 ml-1 text-primary hover:text-primary hover:bg-transparent"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No research expertise areas added yet.</p>
                  )}
                </div>

                {/* Social Links */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-foreground">Social Links</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSocialLink}
                      className="bg-muted/50 hover:bg-muted"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  
                  {Object.entries(socialLinks).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(socialLinks).map(([platform, url]) => (
                        <div key={platform} className="flex items-center gap-2">
                          <Input
                            value={`${platform}: ${url}`}
                            readOnly
                            className="bg-input/50 border-border"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSocialLink(platform)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No social links added yet.</p>
                  )}
                </div>

                <div className="flex gap-3 pt-6">
                  <Button 
                    type="submit" 
                    className="metallic-btn flex-1"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/profile')}
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
