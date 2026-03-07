import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { projectAPI } from '../services/api';

const SKILLS = {
  'financial-analysis': {
    id: 'financial-analysis',
    name: '财务分析',
    description: '深度分析公司财务报表，提取关键指标',
    steps: [
      '上传或导入公司财务报表（PDF/URL）',
      'AI自动提取PE、PS、营收等关键指标',
      '生成财务分析报告',
      '导出分析结果'
    ]
  }
};

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const skill = id ? SKILLS[id as keyof typeof SKILLS] : null;

  const handleStart = async () => {
    if (!skill) return;
    setLoading(true);
    try {
      const res = await projectAPI.create(`${skill.name}项目`, skill.id);
      navigate(`/project/${res.data.id}`);
    } catch (err) {
      alert('创建项目失败');
      setLoading(false);
    }
  };

  if (!skill) return <div className="p-8">技能不存在</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-4">{skill.name}</h1>
        <p className="text-gray-600 mb-8">{skill.description}</p>

        <h2 className="text-xl font-semibold mb-4">使用步骤</h2>
        <ol className="space-y-3 mb-8">
          {skill.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </li>
          ))}
        </ol>

        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '创建中...' : '开始使用'}
        </button>
      </div>
    </div>
  );
}
