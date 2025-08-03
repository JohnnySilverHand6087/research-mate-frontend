export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  category: PaperCategory;
  publication_date: string;
  journal?: string;
  doi?: string;
  pdf_url?: string;
  pdf_file?: string;
  tags: string[];
  notes: PaperNote[];
  created_at: string;
  updated_at: string;
}

export interface PaperNote {
  id: string;
  paper_id: string;
  content: string;
  page_number?: number;
  position?: {
    x: number;
    y: number;
  };
  highlight_text?: string;
  created_at: string;
  updated_at: string;
}

export enum PaperCategory {
  MACHINE_LEARNING = 'machine_learning',
  ARTIFICIAL_INTELLIGENCE = 'artificial_intelligence',
  COMPUTER_VISION = 'computer_vision',
  NATURAL_LANGUAGE_PROCESSING = 'natural_language_processing',
  ROBOTICS = 'robotics',
  DATA_SCIENCE = 'data_science',
  BIOINFORMATICS = 'bioinformatics',
  CYBERSECURITY = 'cybersecurity',
  SOFTWARE_ENGINEERING = 'software_engineering',
  HUMAN_COMPUTER_INTERACTION = 'human_computer_interaction',
  OTHER = 'other'
}

export interface CreatePaperRequest {
  title: string;
  authors: string[];
  abstract: string;
  category: PaperCategory;
  publication_date: string;
  journal?: string;
  doi?: string;
  pdf_url?: string;
  tags: string[];
}

export interface CreateNoteRequest {
  paper_id: string;
  content: string;
  page_number?: number;
  position?: {
    x: number;
    y: number;
  };
  highlight_text?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}