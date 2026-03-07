import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface ReportEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
}

export default function ReportEditor({ initialContent = '', onSave }: ReportEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState(false);

  const handleSave = () => {
    localStorage.setItem('report-draft', content);
    onSave?.(content);
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 p-4 bg-white border-b">
        <button
          onClick={() => setPreview(!preview)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {preview ? '编辑' : '预览'}
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          保存草稿
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          导出
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {preview ? (
          <div className="h-full overflow-auto p-6 bg-white prose max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-6 font-mono resize-none focus:outline-none"
            placeholder="# 开始编写报告..."
          />
        )}
      </div>
    </div>
  );
}
