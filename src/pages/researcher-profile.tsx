import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Globe, ExternalLink, Building, BookOpen, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProtectedLayout } from '@/components/layout/protected-layout';

// Dummy researcher data (in real app, this would come from API)
const dummyResearchers = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    institution: 'Stanford University',
    department: 'Computer Science',
    expertise: ['Machine Learning', 'Natural Language Processing', 'AI Ethics'],
    publications: 45,
    citations: 2340,
    avatar: null,
    bio: 'Dr. Sarah Chen is a leading researcher in machine learning and AI ethics. Her work focuses on developing responsible AI systems and understanding the societal implications of artificial intelligence.',
    website: 'https://sarahchen.com',
    orcid_id: '0000-0001-2345-6789',
    social_links: {
      twitter: 'https://twitter.com/sarahchen',
      linkedin: 'https://linkedin.com/in/sarahchen'
    }
  },
  {
    id: '2',
    name: 'Prof. Michael Rodriguez',
    email: 'm.rodriguez@research.org',
    institution: 'MIT',
    department: 'Cognitive Science',
    expertise: ['Cognitive Computing', 'Human-AI Interaction', 'Neural Networks'],
    publications: 62,
    citations: 3890,
    avatar: null,
    bio: 'Professor Rodriguez is a pioneer in cognitive computing and human-AI interaction research. His interdisciplinary work bridges neuroscience, computer science, and psychology.',
    website: 'https://michaelrodriguez.mit.edu',
    orcid_id: '0000-0002-3456-7890'
  },
  {
    id: '3',
    name: 'Dr. Aisha Patel',
    email: 'aisha.patel@tech.edu',
    institution: 'Carnegie Mellon University',
    department: 'Robotics Institute',
    expertise: ['Robotics', 'Computer Vision', 'Autonomous Systems'],
    publications: 38,
    citations: 1890,
    avatar: null,
    bio: 'Dr. Patel specializes in autonomous robotics and computer vision. Her research has applications in autonomous vehicles, medical robotics, and industrial automation.',
    website: 'https://aishapatel.cmu.edu',
    orcid_id: '0000-0003-4567-8901'
  },
  {
    id: '4',
    name: 'Prof. James Thompson',
    email: 'j.thompson@science.ac.uk',
    institution: 'Oxford University',
    department: 'Mathematics',
    expertise: ['Applied Mathematics', 'Statistical Modeling', 'Data Science'],
    publications: 73,
    citations: 4560,
    avatar: null,
    bio: 'Professor Thompson is a distinguished mathematician working at the intersection of applied mathematics and data science. His statistical models are widely used in various scientific domains.',
    website: 'https://jamesthompson.ox.ac.uk',
    orcid_id: '0000-0004-5678-9012'
  },
];

export const ResearcherProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const researcher = dummyResearchers.find(r => r.id === id);

  if (!researcher) {
    return (
      <ProtectedLayout>
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <Link to="/researchers">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Researcher Not Found</h1>
              <p className="text-muted-foreground">The requested researcher profile could not be found.</p>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Link to="/researchers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Researcher Profile</h1>
            <p className="text-muted-foreground">View detailed information about this researcher</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="glass-effect border-border/50">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-2 border-primary/20">
                <AvatarImage src={researcher.avatar} alt={researcher.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {researcher.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">{researcher.name}</h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Building className="w-4 h-4 mr-2" />
                  {researcher.institution} • {researcher.department}
                </div>

                <div className="flex items-center text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  {researcher.email}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {researcher.publications} publications
                  </div>
                  <div className="flex items-center">
                    <Quote className="w-4 h-4 mr-1" />
                    {researcher.citations} citations
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Bio */}
            {researcher.bio && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Bio</h3>
                <p className="text-muted-foreground leading-relaxed">{researcher.bio}</p>
              </div>
            )}

            {/* Research Expertise */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Research Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {researcher.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/20 text-primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              {researcher.website && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Website</h3>
                  <a
                    href={researcher.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-bright-cyan transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {researcher.website}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}

              {researcher.orcid_id && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">ORCID ID</h3>
                  <a
                    href={`https://orcid.org/${researcher.orcid_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-bright-cyan transition-colors"
                  >
                    <span className="w-4 h-4 mr-2 font-bold">⚬</span>
                    {researcher.orcid_id}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            {researcher.social_links && Object.keys(researcher.social_links).length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Social Links</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(researcher.social_links).map(([platform, url]) => (
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

            {/* Research Metrics */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Research Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{researcher.publications}</div>
                    <div className="text-sm text-muted-foreground">Publications</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{researcher.citations}</div>
                    <div className="text-sm text-muted-foreground">Citations</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{Math.round(researcher.citations / researcher.publications)}</div>
                    <div className="text-sm text-muted-foreground">Citations/Paper</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{researcher.expertise.length}</div>
                    <div className="text-sm text-muted-foreground">Research Areas</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  );
};