import { useState } from 'react';

interface SlideCreationProps {
  onGenerate: (html: string, css: string, js: string) => void;
  projectId?: string;
}

const templates = [
  { id: 'professional', name: 'Professional', bg: 'bg-white', heading: 'text-blue-900', accent: 'bg-blue-600' },
  { id: 'creative', name: 'Creative', bg: 'bg-gray-800', heading: 'text-amber-300', accent: 'bg-rose-500' },
  { id: 'minimalist', name: 'Minimalist', bg: 'bg-gray-100', heading: 'text-gray-800', accent: 'bg-gray-800' },
  { id: 'tech', name: 'Tech', bg: 'bg-gray-900', heading: 'text-cyan-400', accent: 'bg-fuchsia-500' },
];

export default function SlideCreation({ onGenerate, projectId }: SlideCreationProps) {
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState('professional');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/slides/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, template, projectId }),
      });
      const { html, css, js } = await response.json();
      onGenerate(html, css, js);
    } catch (error) {
      alert('生成失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">创建演示文稿</h1>
        <p className="text-gray-400 mb-8">描述您的幻灯片内容，AI 将为您生成</p>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">内容描述</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：创建一个关于可再生能源的5页演示文稿..."
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">选择模板</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={`border-2 rounded-lg overflow-hidden transition-all ${
                    template === t.id ? 'border-purple-500 scale-105' : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className={`${t.bg} h-16 flex flex-col justify-center items-center`}>
                    <div className={`font-bold text-xs ${t.heading}`}>标题</div>
                    <div className={`h-0.5 w-8 mt-1 ${t.accent}`}></div>
                  </div>
                  <div className="p-2 bg-gray-700 text-xs">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900/50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md"
          >
            {isLoading ? '生成中...' : '生成幻灯片'}
          </button>
        </form>
      </div>
    </div>
  );
}
