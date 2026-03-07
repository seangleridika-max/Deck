import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sourceAPI } from '../services/api';

interface Source {
  id: string;
  type: string;
  url?: string;
  title?: string;
  created_at: string;
}

export default function KnowledgeBasePage() {
  const { projectId } = useParams();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadSources();
  }, [projectId]);

  const loadSources = async () => {
    try {
      const { data } = await sourceAPI.list(projectId!);
      setSources(data.sources);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      if (addType === 'url') {
        if (!url.trim()) return;
        await sourceAPI.create(projectId!, 'url', url, title || url);
      } else {
        if (!file) return;
        const content = await file.text();
        await sourceAPI.create(projectId!, 'file', undefined, title || file.name, content);
      }
      setUrl('');
      setTitle('');
      setFile(null);
      setShowAdd(false);
      loadSources();
    } catch (error) {
      console.error('添加失败:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除？')) return;
    try {
      await sourceAPI.delete(id);
      loadSources();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold">知识库管理</h1>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          添加资料
        </button>

        {showAdd && (
          <div className="mb-6 p-4 bg-white rounded shadow">
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => setAddType('url')}
                className={`px-3 py-1 rounded ${addType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                URL
              </button>
              <button
                onClick={() => setAddType('file')}
                className={`px-3 py-1 rounded ${addType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                文件
              </button>
            </div>
            <input
              type="text"
              placeholder="标题（可选）"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            {addType === 'url' ? (
              <input
                type="url"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full mb-2 px-3 py-2 border rounded"
              />
            ) : (
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full mb-2 px-3 py-2 border rounded"
              />
            )}
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              确认添加
            </button>
          </div>
        )}

        <div className="space-y-3">
          {sources.map((source) => (
            <div key={source.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">{source.title || source.url}</div>
                <div className="text-sm text-gray-500">{source.type}</div>
              </div>
              <button
                onClick={() => handleDelete(source.id)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
              >
                删除
              </button>
            </div>
          ))}
          {sources.length === 0 && (
            <div className="text-center text-gray-500 py-8">暂无资料</div>
          )}
        </div>
      </main>
    </div>
  );
}
