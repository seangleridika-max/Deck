export type SkillStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface SkillConfig {
  [key: string]: any;
}

export interface SkillStep {
  id: string;
  name: string;
  type: 'data-gathering' | 'analysis' | 'synthesis' | 'visualization';
  config?: SkillConfig;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  steps: SkillStep[];
  config: SkillConfig;
}

export interface SkillTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: SkillStep[];
  defaultConfig: SkillConfig;
}

export interface SkillExecutionContext {
  skillId: string;
  projectId?: string;
  input: any;
  config: SkillConfig;
}

export interface SkillExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  metadata?: {
    startTime: number;
    endTime: number;
    duration: number;
  };
}
