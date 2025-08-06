// API Provider Configuration Types
export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE_GEMINI = 'google_gemini',
  GROK = 'grok',
  HUGGINGFACE = 'huggingface'
}

export enum EmbeddingProvider {
  OPENAI = 'openai',
  HUGGINGFACE = 'huggingface',
  GOOGLE = 'google',
  COHERE = 'cohere'
}

export enum PaperProvider {
  ARXIV = 'arxiv',
  SEMANTIC_SCHOLAR = 'semantic_scholar',
  PUBMED = 'pubmed',
  CROSSREF = 'crossref'
}

// API Configuration Interfaces
export interface ChatConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface EmbeddingConfig {
  provider: EmbeddingProvider;
  apiKey: string;
  model: string;
  dimensions?: number;
}

export interface PaperConfig {
  provider: PaperProvider;
  apiKey?: string; // Some providers don't need API keys
  enabled: boolean;
}

export interface ApiSettings {
  id: string;
  userId: string;
  chatConfig: ChatConfig;
  embeddingConfig: EmbeddingConfig;
  paperConfigs: PaperConfig[];
  createdAt: string;
  updatedAt: string;
}

// Provider Models Configuration
export const PROVIDER_MODELS = {
  [AIProvider.OPENAI]: [
    'gpt-4.1-2025-04-14',
    'o3-2025-04-16',
    'o4-mini-2025-04-16',
    'gpt-4.1-mini-2025-04-14'
  ],
  [AIProvider.ANTHROPIC]: [
    'claude-opus-4-20250514',
    'claude-sonnet-4-20250514',
    'claude-3-5-haiku-20241022'
  ],
  [AIProvider.GOOGLE_GEMINI]: [
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.0-pro'
  ],
  [AIProvider.GROK]: [
    'grok-beta',
    'grok-vision-beta'
  ],
  [AIProvider.HUGGINGFACE]: [
    'microsoft/DialoGPT-large',
    'facebook/blenderbot-400M-distill',
    'mistralai/Mixtral-8x7B-Instruct-v0.1'
  ]
};

export const EMBEDDING_MODELS = {
  [EmbeddingProvider.OPENAI]: [
    'text-embedding-3-large',
    'text-embedding-3-small',
    'text-embedding-ada-002'
  ],
  [EmbeddingProvider.HUGGINGFACE]: [
    'sentence-transformers/all-MiniLM-L6-v2',
    'sentence-transformers/all-mpnet-base-v2',
    'BAAI/bge-large-en-v1.5'
  ],
  [EmbeddingProvider.GOOGLE]: [
    'models/embedding-001',
    'models/text-embedding-004'
  ],
  [EmbeddingProvider.COHERE]: [
    'embed-english-v3.0',
    'embed-multilingual-v3.0'
  ]
};

// Request/Response Types
export interface CreateApiSettingsRequest {
  chatConfig: Omit<ChatConfig, 'provider'> & { provider: string };
  embeddingConfig: Omit<EmbeddingConfig, 'provider'> & { provider: string };
  paperConfigs: Array<Omit<PaperConfig, 'provider'> & { provider: string }>;
}

export interface UpdateApiSettingsRequest extends Partial<CreateApiSettingsRequest> {}