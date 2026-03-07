import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReportEditor from '../components/ReportEditor';

export default function ProjectPage() {
  const { id } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    const draft = localStorage.getItem('report-draft');
    if (draft) setContent(draft);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold">项目报告编辑器 - {id}</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <ReportEditor initialContent={content} />
      </main>
    </div>
  );
}
