// Cloudflare环境绑定
export interface Env {
  DECK_DB: D1Database;
  DECK_ASSETS: R2Bucket;
  DECK_TOKEN: string;
  GEMINI_API_KEY: string;
  MAX_UPLOAD_MB?: string;
}

// 用户
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

// 项目
export interface Project {
  id: string;
  userId: string;
  title: string;
  skillId?: string;
  status: 'active' | 'completed' | 'archived';
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

// 资料来源
export interface Source {
  id: string;
  projectId: string;
  type: 'url' | 'pdf' | 'video' | 'text';
  url?: string;
  content: string;
  metadata?: string;
  createdAt: string;
}

// 研究日志
export interface ResearchLog {
  id: number;
  projectId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: string;
  createdAt: string;
}

// 资产
export interface Asset {
  id: number;
  projectId: string;
  objectKey: string;
  filename: string;
  contentType?: string;
  size: number;
  createdAt: string;
}

// 对话
export interface Conversation {
  id: string;
  sessionId: string;
  createdAt: string;
}

// 消息
export interface Message {
  id: number;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}
