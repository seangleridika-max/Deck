import { skillEngine } from './engine';
import { financialAnalysisTemplate, generalResearchTemplate } from './templates';

// Initialize skill engine with templates
skillEngine.registerTemplate(financialAnalysisTemplate);
skillEngine.registerTemplate(generalResearchTemplate);

// Create a skill from template
const skill = skillEngine.createSkillFromTemplate('financial-analysis', {
  id: 'my-financial-analysis',
  config: { symbol: 'AAPL' },
});

if (skill) {
  skillEngine.registerSkill(skill);
}

// Execute skill
export async function executeFinancialAnalysis(symbol: string) {
  const result = await skillEngine.execute({
    skillId: 'my-financial-analysis',
    input: { symbol },
    config: { symbol },
  });

  return result;
}
