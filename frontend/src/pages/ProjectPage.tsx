import { useParams } from 'react-router-dom';

export default function ProjectPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold">项目详情</h1>
      </header>
      <main className="max-w-7xl mx-auto p-6">
        <p>项目 ID: {id}</p>
        <p className="text-gray-500 mt-4">功能开发中...</p>
      </main>
    </div>
  );
}
