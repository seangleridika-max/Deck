export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  skillId?: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Source {
  id: string;
  projectId: string;
  type: 'url' | 'pdf' | 'video' | 'text';
  url?: string;
  content: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  steps: string[];
}
