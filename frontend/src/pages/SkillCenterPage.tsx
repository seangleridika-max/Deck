import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { skillAPI } from '../services/api';

interface Skill {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  usageCount: number;
}

export default function SkillCenterPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { data } = await skillAPI.list();
      setSkills(data.skills || []);
    } catch {
      setSkills([
        { id: '1', name: '幻灯片生成', description: '自动生成演示文稿', enabled: true, usageCount: 45 },
        { id: '2', name: '数据分析', description: '财务数据分析工具', enabled: true, usageCount: 32 },
        { id: '3', name: '视频渲染', description: '演示视频生成', enabled: false, usageCount: 12 }
      ]);
    }
  };

  const toggleSkill = async (skill: Skill) => {
    const updated = { ...skill, enabled: !skill.enabled };
    try {
      await skillAPI.update(skill.id, { enabled: updated.enabled });
      setSkills(skills.map(s => s.id === skill.id ? updated : s));
      if (selectedSkill?.id === skill.id) setSelectedSkill(updated);
    } catch {
      setSkills(skills.map(s => s.id === skill.id ? updated : s));
      if (selectedSkill?.id === skill.id) setSelectedSkill(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">技能中心</h1>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600">返回工作台</button>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 className="text-2xl font-bold mb-4">技能列表</h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`bg-white p-4 rounded shadow cursor-pointer hover:shadow-lg ${
                    selectedSkill?.id === skill.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{skill.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSkill(skill);
                      }}
                      className={`px-3 py-1 rounded text-sm ${
                        skill.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {skill.enabled ? '已启用' : '已禁用'}
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    使用次数: {skill.usageCount}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">技能配置</h2>
            {selectedSkill ? (
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mb-3">{selectedSkill.name}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">状态</label>
                    <button
                      onClick={() => toggleSkill(selectedSkill)}
                      className={`w-full px-4 py-2 rounded ${
                        selectedSkill.enabled ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {selectedSkill.enabled ? '启用' : '禁用'}
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">描述</label>
                    <p className="text-sm text-gray-600">{selectedSkill.description}</p>
                  </div>
                  <div className="pt-3 border-t">
                    <h4 className="font-medium mb-2">使用统计</h4>
                    <div className="text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">总使用次数</span>
                        <span className="font-medium">{selectedSkill.usageCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded shadow text-center text-gray-500">
                选择一个技能查看配置
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
