import { SkillTemplate } from '../types';

export const financialAnalysisTemplate: SkillTemplate = {
  id: 'financial-analysis',
  name: 'Financial Analysis',
  description: 'Deep financial analysis with data gathering and research',
  category: 'research',
  steps: [
    { id: 'gather-data', name: 'Gather Financial Data', type: 'data-gathering' },
    { id: 'analyze', name: 'Analyze Data', type: 'analysis' },
    { id: 'synthesize', name: 'Synthesize Report', type: 'synthesis' },
    { id: 'visualize', name: 'Create Visualization', type: 'visualization' },
  ],
  defaultConfig: {
    mode: 'deep',
    useFmp: true,
  },
};

export const generalResearchTemplate: SkillTemplate = {
  id: 'general-research',
  name: 'General Research',
  description: 'Quick general research and analysis',
  category: 'research',
  steps: [
    { id: 'research', name: 'Perform Research', type: 'analysis' },
    { id: 'visualize', name: 'Create Visualization', type: 'visualization' },
  ],
  defaultConfig: {
    mode: 'general',
  },
};
