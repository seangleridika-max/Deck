import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { useAuthStore } from '../store/auth';

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await projectAPI.list();
    setProjects(data.projects);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await projectAPI.create(title);
    setTitle('');
    setShowCreate(false);
    loadProjects();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Deck 工作台</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/profile')} className="text-sm text-gray-600">用户中心</button>
          <button onClick={logout} className="text-sm text-gray-600">退出</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">我的项目</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + 新建项目
          </button>
        </div>
        {showCreate && (
          <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6">
            <input
              type="text"
              placeholder="项目标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-2"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                创建
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                取消
              </button>
            </div>
          </form>
        )}
        <div className="grid grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg"
            >
              <h3 className="font-bold mb-2">{project.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
