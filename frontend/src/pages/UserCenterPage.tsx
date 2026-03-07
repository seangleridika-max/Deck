import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuthStore } from '../store/auth';

export default function UserCenterPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const [userRes, statsRes] = await Promise.all([
      userAPI.getProfile(),
      userAPI.getStats()
    ]);
    setUser(userRes.data);
    setStats(statsRes.data);
  };

  if (!user || !stats) return <div className="p-6">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">用户中心</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-600">返回工作台</button>
          <button onClick={logout} className="text-sm text-gray-600">退出</button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">个人信息</h2>
          <div className="space-y-2">
            <div><span className="text-gray-600">姓名：</span>{user.name}</div>
            <div><span className="text-gray-600">邮箱：</span>{user.email}</div>
            <div><span className="text-gray-600">注册时间：</span>{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
        </section>

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">订阅计划</h2>
          <div className="border rounded p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold">免费版</div>
                <div className="text-sm text-gray-600">基础功能</div>
              </div>
              <div className="text-blue-600 font-bold">当前计划</div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold mb-4">使用统计</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <div className="text-2xl font-bold">{stats.projectCount}</div>
              <div className="text-sm text-gray-600">项目总数</div>
            </div>
            <div className="border rounded p-4">
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
              <div className="text-sm text-gray-600">活跃项目</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
