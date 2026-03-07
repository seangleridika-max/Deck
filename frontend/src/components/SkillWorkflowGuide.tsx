import { useState } from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface SkillWorkflowGuideProps {
  skill: { id: string; name: string; steps: number };
  onClose: () => void;
}

const STEP_DATA: Record<string, Step[]> = {
  '1': [
    { id: 1, title: '需求收集', description: '收集用户需求和业务目标' },
    { id: 2, title: '需求分析', description: '分析需求可行性和优先级' },
    { id: 3, title: '需求文档', description: '编写需求规格说明书' }
  ],
  '2': [
    { id: 1, title: '技术选型', description: '选择合适的技术栈' },
    { id: 2, title: '架构设计', description: '设计系统架构' },
    { id: 3, title: '接口设计', description: '定义API接口' },
    { id: 4, title: '方案评审', description: '技术方案评审' }
  ],
  '3': [
    { id: 1, title: '环境搭建', description: '配置开发环境' },
    { id: 2, title: '编码实现', description: '实现核心功能' },
    { id: 3, title: '单元测试', description: '编写测试用例' },
    { id: 4, title: '代码审查', description: '代码质量检查' },
    { id: 5, title: '集成测试', description: '完整功能测试' }
  ]
};

export default function SkillWorkflowGuide({ skill, onClose }: SkillWorkflowGuideProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = STEP_DATA[skill.id] || [];
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{skill.name}</h2>
        <button onClick={onClose} className="text-gray-600">✕</button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>进度</span>
          <span>{currentStep} / {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-4 rounded border-2 ${
              step.id === currentStep
                ? 'border-blue-600 bg-blue-50'
                : step.id < currentStep
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id < currentStep
                    ? 'bg-green-500 text-white'
                    : step.id === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <div>
                <h3 className="font-bold">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          上一步
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          下一步
        </button>
      </div>
    </div>
  );
}
