import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Users, BookOpen, Brain, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-bright-cyan to-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">RM</span>
            </div>
            <span className="font-bold text-xl text-foreground">Research Mate</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your Smart Research
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bright-cyan to-primary"> Assistant</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Navigate the overwhelming world of academic research with AI-powered search, 
            intelligent summaries, and seamless collaboration tools designed for modern researchers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Researching
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            Revolutionize Your Research Workflow
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            From overwhelming paper lists to focused insights. Research Mate transforms how you discover, 
            understand, and collaborate on academic research.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border bg-card">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI-Powered Search</CardTitle>
                <CardDescription>
                  Get relevant paper recommendations using advanced LLM-based search that understands context and meaning.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Instant Summaries</CardTitle>
                <CardDescription>
                  Grasp key insights without reading entire papers. Our AI generates concise, accurate summaries of research content.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Form research groups, share collections, discuss findings, and work together seamlessly on shared projects.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Organization</CardTitle>
                <CardDescription>
                  Bookmark papers, leave notes, and organize findings into personalized collections for easy access.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <Search className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Advanced Discovery</CardTitle>
                <CardDescription>
                  Find researchers, papers, and collaborators with intelligent search that goes beyond simple keyword matching.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Personalized Dashboard</CardTitle>
                <CardDescription>
                  Track your activity, monitor project progress, and manage your research workflow from a unified interface.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                The Research Challenge
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Academic research is growing at an overwhelming pace. Students and researchers face:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Endless lists of potentially relevant papers</li>
                  <li>Time-consuming manual review processes</li>
                  <li>Difficulty staying current with latest findings</li>
                  <li>Isolated research workflows</li>
                  <li>Lack of collaborative tools for academic work</li>
                </ul>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Our Solution
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Research Mate leverages cutting-edge AI to transform your research experience:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Intelligent paper discovery and recommendations</li>
                  <li>Instant AI-generated summaries</li>
                  <li>Collaborative research environments</li>
                  <li>Organized project management</li>
                  <li>Seamless team communication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-bright-cyan/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Transform Your Research?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join researchers who are already using AI to accelerate their discoveries 
            and collaborate more effectively.
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8">
              Start Your Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-card/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-bright-cyan to-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">RM</span>
            </div>
            <span className="font-bold text-lg text-foreground">Research Mate</span>
          </div>
          <p className="text-muted-foreground">
            Empowering researchers with AI-driven insights and collaboration tools.
          </p>
        </div>
      </footer>
    </div>
  );
};