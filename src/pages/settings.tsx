import React, { useState, useEffect } from 'react';
import { ProtectedLayout } from '@/components/layout/protected-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertCircle, CheckCircle, Eye, EyeOff, TestTube } from 'lucide-react';
import { useApiSettings, useUpdateApiSettings, useTestApiConnection } from '@/hooks/useApiSettings';
import { 
  AIProvider, 
  EmbeddingProvider, 
  PaperProvider, 
  PROVIDER_MODELS, 
  EMBEDDING_MODELS,
  ChatConfig,
  EmbeddingConfig,
  PaperConfig
} from '@/types/settings';

export const SettingsPage: React.FC = () => {
  const { data: apiSettings, isLoading } = useApiSettings();
  const updateSettings = useUpdateApiSettings();
  const testConnection = useTestApiConnection();

  const [chatConfig, setChatConfig] = useState<ChatConfig>({
    provider: AIProvider.OPENAI,
    apiKey: '',
    model: 'gpt-4.1-2025-04-14',
    temperature: 0.7,
    maxTokens: 4000
  });

  const [embeddingConfig, setEmbeddingConfig] = useState<EmbeddingConfig>({
    provider: EmbeddingProvider.OPENAI,
    apiKey: '',
    model: 'text-embedding-3-large',
    dimensions: 1536
  });

  const [paperConfigs, setPaperConfigs] = useState<PaperConfig[]>([
    { provider: PaperProvider.ARXIV, enabled: true },
    { provider: PaperProvider.SEMANTIC_SCHOLAR, enabled: true },
    { provider: PaperProvider.PUBMED, apiKey: '', enabled: false },
    { provider: PaperProvider.CROSSREF, enabled: false }
  ]);

  const [showApiKeys, setShowApiKeys] = useState(false);

  useEffect(() => {
    if (apiSettings) {
      setChatConfig(apiSettings.chatConfig);
      setEmbeddingConfig(apiSettings.embeddingConfig);
      setPaperConfigs(apiSettings.paperConfigs);
    }
  }, [apiSettings]);

  const handleSaveSettings = () => {
    updateSettings.mutate({
      chatConfig: {
        ...chatConfig,
        provider: chatConfig.provider.toString()
      },
      embeddingConfig: {
        ...embeddingConfig,
        provider: embeddingConfig.provider.toString()
      },
      paperConfigs: paperConfigs.map(config => ({
        ...config,
        provider: config.provider.toString()
      }))
    });
  };

  const handleTestConnection = (type: 'chat' | 'embedding') => {
    if (type === 'chat') {
      testConnection.mutate({
        provider: chatConfig.provider,
        apiKey: chatConfig.apiKey,
        model: chatConfig.model
      });
    } else {
      testConnection.mutate({
        provider: embeddingConfig.provider,
        apiKey: embeddingConfig.apiKey,
        model: embeddingConfig.model
      });
    }
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
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
            <h1 className="text-3xl font-bold text-foreground">API Settings</h1>
            <p className="text-muted-foreground">Configure your AI providers and API keys</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiKeys(!showApiKeys)}
            >
              {showApiKeys ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showApiKeys ? 'Hide' : 'Show'} Keys
            </Button>
            <Button 
              onClick={handleSaveSettings}
              disabled={updateSettings.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {updateSettings.isPending && <LoadingSpinner size="sm" className="mr-2" />}
              Save Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat AI</TabsTrigger>
            <TabsTrigger value="embeddings">Embeddings</TabsTrigger>
            <TabsTrigger value="papers">Paper Sources</TabsTrigger>
          </TabsList>

          {/* Chat AI Configuration */}
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Chat AI Configuration
                  <Badge variant="secondary">{chatConfig.provider.toUpperCase()}</Badge>
                </CardTitle>
                <CardDescription>
                  Configure your preferred AI provider for chat functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chat-provider">Provider</Label>
                    <Select
                      value={chatConfig.provider}
                      onValueChange={(value: AIProvider) => {
                        setChatConfig(prev => ({
                          ...prev,
                          provider: value,
                          model: PROVIDER_MODELS[value][0]
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(AIProvider).map(provider => (
                          <SelectItem key={provider} value={provider}>
                            {provider.replace('_', ' ').toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chat-model">Model</Label>
                    <Select
                      value={chatConfig.model}
                      onValueChange={(value) => setChatConfig(prev => ({ ...prev, model: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDER_MODELS[chatConfig.provider]?.map(model => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chat-api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="chat-api-key"
                      type={showApiKeys ? 'text' : 'password'}
                      value={chatConfig.apiKey}
                      onChange={(e) => setChatConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Enter your API key"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleTestConnection('chat')}
                      disabled={!chatConfig.apiKey || testConnection.isPending}
                    >
                      {testConnection.isPending ? <LoadingSpinner size="sm" /> : <TestTube className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={chatConfig.temperature}
                      onChange={(e) => setChatConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <Input
                      id="max-tokens"
                      type="number"
                      min="1"
                      max="8000"
                      value={chatConfig.maxTokens}
                      onChange={(e) => setChatConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Embeddings Configuration */}
          <TabsContent value="embeddings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Embeddings Configuration
                  <Badge variant="secondary">{embeddingConfig.provider.toUpperCase()}</Badge>
                </CardTitle>
                <CardDescription>
                  Configure embeddings for RAG and semantic search
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="embedding-provider">Provider</Label>
                    <Select
                      value={embeddingConfig.provider}
                      onValueChange={(value: EmbeddingProvider) => {
                        setEmbeddingConfig(prev => ({
                          ...prev,
                          provider: value,
                          model: EMBEDDING_MODELS[value][0]
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EmbeddingProvider).map(provider => (
                          <SelectItem key={provider} value={provider}>
                            {provider.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="embedding-model">Model</Label>
                    <Select
                      value={embeddingConfig.model}
                      onValueChange={(value) => setEmbeddingConfig(prev => ({ ...prev, model: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EMBEDDING_MODELS[embeddingConfig.provider]?.map(model => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="embedding-api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="embedding-api-key"
                      type={showApiKeys ? 'text' : 'password'}
                      value={embeddingConfig.apiKey}
                      onChange={(e) => setEmbeddingConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Enter your API key"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleTestConnection('embedding')}
                      disabled={!embeddingConfig.apiKey || testConnection.isPending}
                    >
                      {testConnection.isPending ? <LoadingSpinner size="sm" /> : <TestTube className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {embeddingConfig.dimensions && (
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      type="number"
                      min="1"
                      max="3072"
                      value={embeddingConfig.dimensions}
                      onChange={(e) => setEmbeddingConfig(prev => ({ ...prev, dimensions: parseInt(e.target.value) }))}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paper Sources Configuration */}
          <TabsContent value="papers">
            <Card>
              <CardHeader>
                <CardTitle>Paper Sources Configuration</CardTitle>
                <CardDescription>
                  Configure research paper databases and APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paperConfigs.map((config, index) => (
                  <div key={config.provider} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(enabled) => {
                            const newConfigs = [...paperConfigs];
                            newConfigs[index] = { ...config, enabled };
                            setPaperConfigs(newConfigs);
                          }}
                        />
                        <div>
                          <h4 className="font-medium">{config.provider.replace('_', ' ').toUpperCase()}</h4>
                          <p className="text-sm text-muted-foreground">
                            {config.provider === PaperProvider.ARXIV && 'Open access preprints in physics, mathematics, computer science, and more'}
                            {config.provider === PaperProvider.SEMANTIC_SCHOLAR && 'AI-powered academic search engine'}
                            {config.provider === PaperProvider.PUBMED && 'Biomedical literature database'}
                            {config.provider === PaperProvider.CROSSREF && 'Scholarly metadata and DOI resolution'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={config.enabled ? 'default' : 'secondary'}>
                        {config.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>

                    {config.enabled && (config.provider === PaperProvider.PUBMED || config.provider === PaperProvider.CROSSREF) && (
                      <div className="space-y-2">
                        <Label htmlFor={`${config.provider}-api-key`}>
                          API Key {config.provider === PaperProvider.PUBMED ? '(Optional)' : ''}
                        </Label>
                        <Input
                          id={`${config.provider}-api-key`}
                          type={showApiKeys ? 'text' : 'password'}
                          value={config.apiKey || ''}
                          onChange={(e) => {
                            const newConfigs = [...paperConfigs];
                            newConfigs[index] = { ...config, apiKey: e.target.value };
                            setPaperConfigs(newConfigs);
                          }}
                          placeholder={`Enter your ${config.provider} API key`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  );
};