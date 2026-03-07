import { Skill, SkillTemplate, SkillExecutionContext, SkillExecutionResult } from './types';

export class SkillEngine {
  private skills: Map<string, Skill> = new Map();
  private templates: Map<string, SkillTemplate> = new Map();

  registerSkill(skill: Skill): void {
    this.skills.set(skill.id, skill);
  }

  registerTemplate(template: SkillTemplate): void {
    this.templates.set(template.id, template);
  }

  getSkill(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  getTemplate(id: string): SkillTemplate | undefined {
    return this.templates.get(id);
  }

  listSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  listTemplates(): SkillTemplate[] {
    return Array.from(this.templates.values());
  }

  createSkillFromTemplate(templateId: string, overrides?: Partial<Skill>): Skill | null {
    const template = this.templates.get(templateId);
    if (!template) return null;

    return {
      id: overrides?.id || `${templateId}-${Date.now()}`,
      name: overrides?.name || template.name,
      description: overrides?.description || template.description,
      steps: overrides?.steps || template.steps,
      config: { ...template.defaultConfig, ...overrides?.config },
    };
  }

  async execute(context: SkillExecutionContext): Promise<SkillExecutionResult> {
    const startTime = Date.now();
    const skill = this.skills.get(context.skillId);

    if (!skill) {
      return {
        success: false,
        error: `Skill not found: ${context.skillId}`,
        metadata: { startTime, endTime: Date.now(), duration: 0 },
      };
    }

    try {
      const output = await this.executeSkill(skill, context);
      const endTime = Date.now();

      return {
        success: true,
        output,
        metadata: { startTime, endTime, duration: endTime - startTime },
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { startTime, endTime, duration: endTime - startTime },
      };
    }
  }

  private async executeSkill(skill: Skill, context: SkillExecutionContext): Promise<any> {
    const results: any[] = [];

    for (const step of skill.steps) {
      const stepResult = await this.executeStep(step, context);
      results.push(stepResult);
    }

    return results;
  }

  private async executeStep(step: any, context: SkillExecutionContext): Promise<any> {
    return { stepId: step.id, status: 'completed' };
  }
}

export const skillEngine = new SkillEngine();
