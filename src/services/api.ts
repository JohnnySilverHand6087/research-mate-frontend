
import axios, { AxiosError } from 'axios';
import type { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User, 
  UpdateProfileRequest,
  Affiliation,
  CreateAffiliationRequest,
  UpdateAffiliationRequest,
  ApiError,
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  Document,
  CreateDocumentRequest,
  GroupMember,
  InviteMemberRequest,
  UpdateMemberRoleRequest
} from '@/types/api';
import {
  Paper,
  PaperNote,
  PaperCategory,
  CreatePaperRequest,
  CreateNoteRequest,
  ChatMessage
} from '@/types/papers';
import { PositionType, TaskStatus, TaskPriority, DocumentType, ProjectType, MemberRole } from '@/types/api';

const API_BASE_URL = 'https://api.staging.researchmate.ai/v1';

// Use dummy data for development
const USE_DUMMY_DATA = true;

// Dummy data
const dummyUser: User = {
  id: '1',
  email: 'user@example.com',
  full_name: 'John Doe',
  display_name: 'John',
  bio: 'Researcher at University of Example',
  website: 'https://johndoe.example.com',
  orcid_id: '0000-0000-0000-0000',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  social_links: { twitter: '@johndoe', linkedin: 'johndoe' },
  primary_affiliation: 'University of Example',
  is_verified: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const dummyAffiliations: Affiliation[] = [
  {
    id: '1',
    institution: 'University of Example',
    department: 'Computer Science',
    position_title: 'Assistant Professor',
    position_type: PositionType.FACULTY,
    start_date: '2020-09-01',
    end_date: undefined,
    is_primary: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    institution: 'Tech Corp',
    department: 'Research Division',
    position_title: 'Senior Researcher',
    position_type: PositionType.INDUSTRY,
    start_date: '2018-06-01',
    end_date: '2020-08-31',
    is_primary: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Dummy projects data
const dummyProjects: Project[] = [
  {
    id: '1',
    name: 'Research Paper Analysis',
    description: 'Analyzing recent developments in machine learning research',
    status: 'active',
    type: ProjectType.PERSONAL,
    user_id: '1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    name: 'Literature Review',
    description: 'Comprehensive review of natural language processing literature',
    status: 'active',
    type: ProjectType.PERSONAL,
    user_id: '1',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-18T16:45:00Z',
  },
  {
    id: '3',
    name: 'Thesis Preparation',
    description: 'Preparing final thesis chapters and references',
    status: 'completed',
    type: ProjectType.PERSONAL,
    user_id: '1',
    created_at: '2023-12-01T08:00:00Z',
    updated_at: '2024-01-05T12:00:00Z',
  },
  {
    id: '4',
    name: 'AI Research Collaboration',
    description: 'Collaborative research project on artificial intelligence ethics',
    status: 'active',
    type: ProjectType.GROUP,
    user_id: '1',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-25T14:30:00Z',
  },
  {
    id: '5',
    name: 'Data Science Team Project',
    description: 'Cross-functional team working on data analysis methodologies',
    status: 'active',
    type: ProjectType.GROUP,
    user_id: '2',
    created_at: '2024-01-18T09:00:00Z',
    updated_at: '2024-01-24T16:45:00Z',
  },
];

// Dummy group members data
const dummyGroupMembers: GroupMember[] = [
  {
    id: '1',
    project_id: '4',
    user_id: '1',
    role: MemberRole.LEADER,
    user_name: 'John Doe',
    user_email: 'john@example.com',
    joined_at: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    project_id: '4',
    user_id: '2',
    role: MemberRole.MEMBER,
    user_name: 'Jane Smith',
    user_email: 'jane@example.com',
    joined_at: '2024-01-21T11:00:00Z',
  },
  {
    id: '3',
    project_id: '4',
    user_id: '3',
    role: MemberRole.MEMBER,
    user_name: 'Bob Johnson',
    user_email: 'bob@example.com',
    joined_at: '2024-01-22T12:00:00Z',
  },
  {
    id: '4',
    project_id: '5',
    user_id: '2',
    role: MemberRole.LEADER,
    user_name: 'Jane Smith',
    user_email: 'jane@example.com',
    joined_at: '2024-01-18T09:00:00Z',
  },
  {
    id: '5',
    project_id: '5',
    user_id: '4',
    role: MemberRole.MEMBER,
    user_name: 'Alice Brown',
    user_email: 'alice@example.com',
    joined_at: '2024-01-19T10:00:00Z',
  },
];

// Dummy tasks data
const dummyTasks: Task[] = [
  {
    id: '1',
    project_id: '1',
    title: 'Read latest ML papers',
    description: 'Review 5 recent papers on transformer architectures',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    project_id: '1',
    title: 'Analyze experimental results',
    description: 'Statistical analysis of model performance data',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-18T14:30:00Z',
  },
  {
    id: '3',
    project_id: '1',
    title: 'Write summary report',
    description: 'Compile findings into comprehensive report',
    status: TaskStatus.REVIEW,
    priority: TaskPriority.HIGH,
    created_at: '2024-01-17T09:30:00Z',
    updated_at: '2024-01-19T16:15:00Z',
  },
  {
    id: '4',
    project_id: '1',
    title: 'Setup research environment',
    description: 'Configure development tools and libraries',
    status: TaskStatus.DONE,
    priority: TaskPriority.LOW,
    created_at: '2024-01-14T14:00:00Z',
    updated_at: '2024-01-15T09:45:00Z',
  },
  {
    id: '5',
    project_id: '2',
    title: 'Survey NLP literature',
    description: 'Identify key papers and methodologies',
    status: TaskStatus.TODO,
    priority: TaskPriority.URGENT,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
  },
];

// Dummy documents data
const dummyDocuments: Document[] = [
  {
    id: '1',
    project_id: '1',
    title: 'Attention Is All You Need',
    type: DocumentType.PAPER,
    url: 'https://arxiv.org/abs/1706.03762',
    summary: 'Seminal paper introducing the Transformer architecture',
    tags: ['transformer', 'attention', 'nlp'],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    project_id: '1',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    type: DocumentType.PAPER,
    url: 'https://arxiv.org/abs/1810.04805',
    summary: 'Introduction of BERT model for language understanding',
    tags: ['bert', 'pretraining', 'bidirectional'],
    created_at: '2024-01-16T14:20:00Z',
    updated_at: '2024-01-16T14:20:00Z',
  },
  {
    id: '3',
    project_id: '2',
    title: 'Hugging Face Documentation',
    type: DocumentType.LINK,
    url: 'https://huggingface.co/docs',
    summary: 'Comprehensive guide to using transformer models',
    tags: ['documentation', 'huggingface', 'tutorial'],
    created_at: '2024-01-12T11:15:00Z',
    updated_at: '2024-01-12T11:15:00Z',
  },
];

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !USE_DUMMY_DATA) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        access_token: 'dummy-token',
        token_type: 'Bearer',
        expires_in: 3600,
        user: dummyUser,
      };
    }
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        access_token: 'dummy-token',
        token_type: 'Bearer',
        expires_in: 3600,
        user: { ...dummyUser, email: userData.email, full_name: userData.full_name },
      };
    }
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  getGoogleOAuthUrl(redirectUrl: string): string {
    return `${API_BASE_URL}/auth/oauth/google?redirect=${encodeURIComponent(redirectUrl)}`;
  },
};

// User API
export const userApi = {
  async getMe(): Promise<User> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return dummyUser;
    }
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  async updateProfile(updates: UpdateProfileRequest): Promise<User> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { ...dummyUser, ...updates };
    }
    const response = await apiClient.patch('/users/me', updates);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<User> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { ...dummyUser, avatar_url: URL.createObjectURL(file) };
    }
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.put('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Affiliations API
export const affiliationsApi = {
  async getAffiliations(): Promise<Affiliation[]> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return dummyAffiliations;
    }
    const response = await apiClient.get('/users/me/affiliations');
    return response.data;
  },

  async createAffiliation(affiliation: CreateAffiliationRequest): Promise<Affiliation> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newAffiliation: Affiliation = {
        id: String(Date.now()),
        institution: affiliation.institution,
        department: affiliation.department,
        position_title: affiliation.position_title,
        position_type: affiliation.position_type,
        start_date: affiliation.start_date,
        end_date: affiliation.end_date,
        is_primary: affiliation.is_primary || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dummyAffiliations.push(newAffiliation);
      return newAffiliation;
    }
    const response = await apiClient.post('/users/me/affiliations', affiliation);
    return response.data;
  },

  async updateAffiliation(id: string, updates: UpdateAffiliationRequest): Promise<Affiliation> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = dummyAffiliations.findIndex(a => a.id === id);
      if (index >= 0) {
        dummyAffiliations[index] = { 
          ...dummyAffiliations[index], 
          ...updates, 
          updated_at: new Date().toISOString() 
        };
        return dummyAffiliations[index];
      }
      throw new Error('Affiliation not found');
    }
    const response = await apiClient.patch(`/users/me/affiliations/${id}`, updates);
    return response.data;
  },

  async deleteAffiliation(id: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = dummyAffiliations.findIndex(a => a.id === id);
      if (index >= 0) {
        dummyAffiliations.splice(index, 1);
      }
      return;
    }
    await apiClient.delete(`/users/me/affiliations/${id}`);
  },
};

// Projects API
export const projectsApi = {
  async getProjects(): Promise<Project[]> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return dummyProjects;
    }
    const response = await apiClient.get('/projects');
    return response.data;
  },

  async getProject(id: string): Promise<Project> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const project = dummyProjects.find(p => p.id === id);
      if (!project) throw new Error('Project not found');
      return project;
    }
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(project: CreateProjectRequest): Promise<Project> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newProject: Project = {
        id: String(Date.now()),
        name: project.name,
        description: project.description,
        status: 'active',
        type: project.type || ProjectType.PERSONAL,
        user_id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dummyProjects.push(newProject);
      return newProject;
    }
    const response = await apiClient.post('/projects', project);
    return response.data;
  },

  async updateProject(id: string, updates: UpdateProjectRequest): Promise<Project> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = dummyProjects.findIndex(p => p.id === id);
      if (index >= 0) {
        dummyProjects[index] = {
          ...dummyProjects[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        return dummyProjects[index];
      }
      throw new Error('Project not found');
    }
    const response = await apiClient.patch(`/projects/${id}`, updates);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = dummyProjects.findIndex(p => p.id === id);
      if (index >= 0) {
        dummyProjects.splice(index, 1);
      }
      return;
    }
    await apiClient.delete(`/projects/${id}`);
  },
};

// Tasks API
export const tasksApi = {
  async getTasks(projectId: string): Promise<Task[]> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return dummyTasks.filter(task => task.project_id === projectId);
    }
    const response = await apiClient.get(`/projects/${projectId}/tasks`);
    return response.data;
  },

  async createTask(task: CreateTaskRequest): Promise<Task> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      // For group projects, find assignee name
      let assigneeName = undefined;
      if (task.assigned_to) {
        const member = dummyGroupMembers.find(m => m.user_id === task.assigned_to);
        assigneeName = member?.user_name;
      }

      const newTask: Task = {
        id: String(Date.now()),
        project_id: task.project_id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority || TaskPriority.MEDIUM,
        assigned_to: task.assigned_to,
        assigned_by: '1', // Current user
        assignee_name: assigneeName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dummyTasks.push(newTask);
      return newTask;
    }
    const response = await apiClient.post(`/projects/${task.project_id}/tasks`, task);
    return response.data;
  },

  async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = dummyTasks.findIndex(t => t.id === id);
      if (index >= 0) {
        dummyTasks[index] = {
          ...dummyTasks[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        return dummyTasks[index];
      }
      throw new Error('Task not found');
    }
    const response = await apiClient.patch(`/tasks/${id}`, updates);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = dummyTasks.findIndex(t => t.id === id);
      if (index >= 0) {
        dummyTasks.splice(index, 1);
      }
      return;
    }
    await apiClient.delete(`/tasks/${id}`);
  },
};

// Documents API
export const documentsApi = {
  async getDocuments(projectId: string): Promise<Document[]> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return dummyDocuments.filter(doc => doc.project_id === projectId);
    }
    const response = await apiClient.get(`/projects/${projectId}/documents`);
    return response.data;
  },

  async createDocument(document: CreateDocumentRequest): Promise<Document> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const newDocument: Document = {
        id: String(Date.now()),
        project_id: document.project_id,
        title: document.title,
        type: document.type,
        url: document.url,
        summary: document.summary,
        tags: document.tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dummyDocuments.push(newDocument);
      return newDocument;
    }
    const response = await apiClient.post(`/projects/${document.project_id}/documents`, document);
    return response.data;
  },

  async deleteDocument(id: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = dummyDocuments.findIndex(d => d.id === id);
      if (index >= 0) {
        dummyDocuments.splice(index, 1);
      }
      return;
    }
    await apiClient.delete(`/documents/${id}`);
  },
};

// Papers API
export const papersApi = {
  getPapers: async (): Promise<Paper[]> => {
    // Dummy data for now
    return [
      {
        id: '1',
        title: 'Attention Is All You Need',
        authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar'],
        abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
        category: PaperCategory.MACHINE_LEARNING,
        publication_date: '2017-06-12',
        journal: 'NIPS',
        doi: '10.48550/arXiv.1706.03762',
        pdf_url: 'https://arxiv.org/pdf/1706.03762.pdf',
        tags: ['transformers', 'attention', 'neural networks'],
        notes: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
        authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee'],
        abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers...',
        category: PaperCategory.NATURAL_LANGUAGE_PROCESSING,
        publication_date: '2018-10-11',
        journal: 'NAACL',
        doi: '10.48550/arXiv.1810.04805',
        pdf_url: 'https://arxiv.org/pdf/1810.04805.pdf',
        tags: ['bert', 'nlp', 'transformers'],
        notes: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'ResNet: Deep Residual Learning for Image Recognition',
        authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren'],
        abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework...',
        category: PaperCategory.COMPUTER_VISION,
        publication_date: '2015-12-10',
        journal: 'CVPR',
        doi: '10.48550/arXiv.1512.03385',
        pdf_url: 'https://arxiv.org/pdf/1512.03385.pdf',
        tags: ['resnet', 'computer vision', 'deep learning'],
        notes: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
  },

  createPaper: async (paper: CreatePaperRequest): Promise<Paper> => {
    const newPaper: Paper = {
      id: Date.now().toString(),
      ...paper,
      notes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return newPaper;
  },

  deletePaper: async (id: string): Promise<void> => {
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  addNote: async (note: CreateNoteRequest): Promise<PaperNote> => {
    const newNote: PaperNote = {
      id: Date.now().toString(),
      ...note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return newNote;
  },

  deleteNote: async (noteId: string): Promise<void> => {
    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  chatWithPaper: async (paperId: string, message: string, conversationHistory: ChatMessage[]): Promise<string> => {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response based on the message
      const responses = [
        "Based on this paper, the key findings suggest that...",
        "The methodology described in this research involves...",
        "The authors conclude that the main contribution is...",
        "According to the results section, we can observe that...",
        "The related work indicates that previous studies have...",
      ];
      
      return responses[Math.floor(Math.random() * responses.length)];
    }

    const response = await apiClient.post(`/papers/${paperId}/chat`, {
      message,
      conversation_history: conversationHistory
    });
    return response.data.response;
  },

  searchPapers: async (query: string, count: number): Promise<any[]> => {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock search results
      const mockResults = [
        {
          title: `Deep Learning Approaches for ${query}`,
          authors: ["John Smith", "Jane Doe", "Bob Johnson"],
          abstract: `This paper presents a comprehensive study on ${query} using state-of-the-art deep learning techniques. Our approach demonstrates significant improvements over existing methods.`,
          publication_date: "2024-01-15",
          journal: "Nature Machine Intelligence",
          doi: "10.1038/s42256-024-00001-1",
          pdf_url: "https://example.com/paper1.pdf"
        },
        {
          title: `A Survey of ${query} Methods in Computer Vision`,
          authors: ["Alice Brown", "Charlie Wilson"],
          abstract: `We provide a comprehensive survey of recent advances in ${query} within the computer vision domain. This work covers both theoretical foundations and practical applications.`,
          publication_date: "2023-12-10",
          journal: "IEEE Transactions on Pattern Analysis",
          doi: "10.1109/TPAMI.2023.00002",
          pdf_url: "https://example.com/paper2.pdf"
        },
        {
          title: `Novel ${query} Architecture for Real-time Applications`,
          authors: ["David Lee", "Emma Davis", "Frank Miller"],
          abstract: `We introduce a novel architecture specifically designed for real-time ${query} applications. Our method achieves state-of-the-art performance with minimal computational overhead.`,
          publication_date: "2024-02-20",
          journal: "ACM Computing Surveys",
          doi: "10.1145/3594000.3594001"
        }
      ];
      
      return mockResults.slice(0, Math.min(count, mockResults.length));
    }

    const response = await apiClient.get(`/papers/search`, {
      params: { query, count }
    });
    return response.data;
  },

  searchByDOI: async (doi: string): Promise<any> => {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate mock DOI result
      return {
        title: "Advanced Methods in Machine Learning Research",
        authors: ["Dr. Research Smith", "Prof. Data Jones"],
        abstract: "This paper presents groundbreaking research in machine learning methodologies, focusing on novel approaches to complex data analysis and pattern recognition.",
        publication_date: "2024-03-01",
        journal: "Journal of Advanced Computing",
        doi: doi,
        pdf_url: "https://example.com/doi-paper.pdf"
      };
    }

    const response = await apiClient.get(`/papers/doi/${encodeURIComponent(doi)}`);
    return response.data;
  },
};

// Group Projects API
export const groupProjectsApi = {
  async getProjectMembers(projectId: string): Promise<GroupMember[]> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      return dummyGroupMembers.filter(member => member.project_id === projectId);
    }
    const response = await apiClient.get(`/projects/${projectId}/members`);
    return response.data;
  },

  async inviteMember(projectId: string, invitation: InviteMemberRequest): Promise<GroupMember> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newMember: GroupMember = {
        id: String(Date.now()),
        project_id: projectId,
        user_id: String(Date.now() + Math.random()),
        role: invitation.role || MemberRole.MEMBER,
        user_name: invitation.email.split('@')[0], // Mock name from email
        user_email: invitation.email,
        joined_at: new Date().toISOString(),
      };
      dummyGroupMembers.push(newMember);
      return newMember;
    }
    const response = await apiClient.post(`/projects/${projectId}/members`, invitation);
    return response.data;
  },

  async updateMemberRole(projectId: string, memberId: string, updates: UpdateMemberRoleRequest): Promise<GroupMember> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = dummyGroupMembers.findIndex(m => m.id === memberId && m.project_id === projectId);
      if (index >= 0) {
        dummyGroupMembers[index] = {
          ...dummyGroupMembers[index],
          ...updates,
        };
        return dummyGroupMembers[index];
      }
      throw new Error('Member not found');
    }
    const response = await apiClient.patch(`/projects/${projectId}/members/${memberId}`, updates);
    return response.data;
  },

  async removeMember(projectId: string, memberId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = dummyGroupMembers.findIndex(m => m.id === memberId && m.project_id === projectId);
      if (index >= 0) {
        dummyGroupMembers.splice(index, 1);
      }
      return;
    }
    await apiClient.delete(`/projects/${projectId}/members/${memberId}`);
  },

  async getAvailableUsers(query: string): Promise<{ id: string; name: string; email: string; }[]> {
    if (USE_DUMMY_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const mockUsers = [
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
        { id: '4', name: 'Alice Brown', email: 'alice@example.com' },
        { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com' },
        { id: '6', name: 'David Lee', email: 'david@example.com' },
      ].filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) || 
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      return mockUsers;
    }
    const response = await apiClient.get(`/users/search`, { params: { query } });
    return response.data;
  },
};

// Error handling helper
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response?.data) {
    return error.response.data as ApiError;
  }
  return {
    message: error.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};


