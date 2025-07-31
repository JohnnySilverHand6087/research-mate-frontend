
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
