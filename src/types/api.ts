
// API Response Types based on Research Mate schema

export interface User {
  id: string;
  email: string;
  full_name: string;
  display_name?: string;
  bio?: string;
  website?: string;
  orcid_id?: string;
  avatar_url?: string;
  social_links?: Record<string, string>;
  primary_affiliation?: string;
  research_expertise?: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface UpdateProfileRequest {
  display_name?: string;
  bio?: string;
  website?: string;
  orcid_id?: string;
  social_links?: Record<string, string>;
  research_expertise?: string[];
}

export enum PositionType {
  FACULTY = 'faculty',
  POSTDOC = 'postdoc',
  GRADUATE_STUDENT = 'graduate_student',
  UNDERGRADUATE_STUDENT = 'undergraduate_student',
  RESEARCH_SCIENTIST = 'research_scientist',
  INDUSTRY = 'industry',
  OTHER = 'other'
}

export interface Affiliation {
  id: string;
  institution: string;
  department?: string;
  position_title?: string;
  position_type: PositionType;
  start_date?: string;
  end_date?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAffiliationRequest {
  institution: string;
  department?: string;
  position_title?: string;
  position_type: PositionType;
  start_date?: string;
  end_date?: string;
  is_primary?: boolean;
}

export interface UpdateAffiliationRequest extends Partial<CreateAffiliationRequest> {}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  status?: 'active' | 'completed' | 'archived';
}

// Task Types for Kanban Board
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

// Document Types
export enum DocumentType {
  PAPER = 'paper',
  ARTICLE = 'article',
  LINK = 'link',
  FILE = 'file'
}

export interface Document {
  id: string;
  project_id: string;
  title: string;
  type: DocumentType;
  url?: string;
  file_path?: string;
  summary?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentRequest {
  project_id: string;
  title: string;
  type: DocumentType;
  url?: string;
  summary?: string;
  tags?: string[];
}

export interface UpdateDocumentRequest extends Partial<CreateDocumentRequest> {}
