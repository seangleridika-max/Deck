import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillWorkflowGuide from '../components/SkillWorkflowGuide';

const SKILLS = [
  { id: '1', name: '产品需求分析', steps: 3 },
  { id: '2', name: '技术方案设计', steps: 4 },
  { id: '3', name: '代码实现', steps: 5 }
];

export default function SkillCenterPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">技能中心</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600">
          返回工作台
        </button>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        {!selectedSkill ? (
          <div className="grid grid-cols-3 gap-4">
            {SKILLS.map((skill) => (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill.id)}
                className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg"
              >
                <h3 className="font-bold mb-2">{skill.name}</h3>
                <p className="text-sm text-gray-500">{skill.steps} 个步骤</p>
              </div>
            ))}
          </div>
        ) : (
          <SkillWorkflowGuide
            skill={SKILLS.find((s) => s.id === selectedSkill)!}
            onClose={() => setSelectedSkill(null)}
          />
        )}
      </main>
    </div>
  );
}
