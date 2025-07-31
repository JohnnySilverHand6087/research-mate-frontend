import React, { useState } from 'react';
import { Search, UserPlus, Mail, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Dummy data for researchers
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
  },
];

export const ResearcherSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResearchers, setFilteredResearchers] = useState(dummyResearchers);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredResearchers(dummyResearchers);
      return;
    }

    const filtered = dummyResearchers.filter(researcher =>
      researcher.name.toLowerCase().includes(query.toLowerCase()) ||
      researcher.institution.toLowerCase().includes(query.toLowerCase()) ||
      researcher.department.toLowerCase().includes(query.toLowerCase()) ||
      researcher.expertise.some(skill => 
        skill.toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredResearchers(filtered);
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Find Researchers</h1>
            <p className="text-muted-foreground mt-2">
              Discover and connect with researchers in your field
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, institution, or expertise..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {filteredResearchers.length} Researchers Found
            </h2>
          </div>

          <div className="grid gap-6">
            {filteredResearchers.map((researcher) => (
              <Card key={researcher.id} className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={researcher.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {researcher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{researcher.name}</CardTitle>
                        <CardDescription className="text-base">
                          {researcher.institution} • {researcher.department}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-1">
                          {researcher.publications} publications • {researcher.citations} citations
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-foreground mb-2">Research Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {researcher.expertise.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{researcher.email}</span>
                      <Link to={`/researchers/${researcher.id}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResearchers.length === 0 && searchQuery && (
            <Card className="border-border bg-card">
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No researchers found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse all researchers.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
};