import { useState, useRef } from 'react';

interface SlideEditorProps {
  initialCode: { html: string; css: string; js: string };
  onBack: () => void;
  projectId?: string;
}

export default function SlideEditor({ initialCode, onBack }: SlideEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getFullHtml = () => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Presentation</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>${code.css}</style>
      </head>
      <body>
        ${code.html}
        <script>${code.js}</script>
      </body>
    </html>
  `;

  const handleExport = () => {
    const blob = new Blob([getFullHtml()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="px-3 py-2 rounded-md hover:bg-gray-700">← 返回</button>
          <div className="flex gap-1 bg-gray-900 p-1 rounded-md">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'preview' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
            >
              预览
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'code' ? 'bg-purple-600' : 'hover:bg-gray-700'}`}
            >
              代码
            </button>
          </div>
        </div>
        <button onClick={handleExport} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md">
          导出 PPT
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        {viewMode === 'preview' ? (
          <div className="h-full flex items-center justify-center p-4">
            <iframe
              ref={iframeRef}
              srcDoc={getFullHtml()}
              className="w-full h-full bg-white rounded-lg"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div className="h-full p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2">HTML</label>
              <textarea
                value={code.html}
                onChange={(e) => setCode({ ...code, html: e.target.value })}
                className="flex-1 bg-gray-800 text-gray-200 p-3 border border-gray-700 rounded-md font-mono text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2">CSS</label>
              <textarea
                value={code.css}
                onChange={(e) => setCode({ ...code, css: e.target.value })}
                className="flex-1 bg-gray-800 text-gray-200 p-3 border border-gray-700 rounded-md font-mono text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
