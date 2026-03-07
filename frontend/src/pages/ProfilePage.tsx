import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import api from '../services/api';

interface Stats {
  totalProjects: number;
  totalSources: number;
  totalResearchLogs: number;
  totalAssets: number;
}

export default function ProfilePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data } = await api.get('/users/stats');
    setStats(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">用户中心</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600">返回工作台</button>
          <button onClick={logout} className="text-sm text-gray-600">退出</button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">使用统计</h2>
        {stats && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded shadow">
              <div className="text-3xl font-bold text-blue-600">{stats.totalProjects}</div>
              <div className="text-gray-600 mt-2">项目总数</div>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <div className="text-3xl font-bold text-green-600">{stats.totalSources}</div>
              <div className="text-gray-600 mt-2">资料总数</div>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <div className="text-3xl font-bold text-purple-600">{stats.totalResearchLogs}</div>
              <div className="text-gray-600 mt-2">AI对话次数</div>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <div className="text-3xl font-bold text-orange-600">{stats.totalAssets}</div>
              <div className="text-gray-600 mt-2">生成文件数</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
