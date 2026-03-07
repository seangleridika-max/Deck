import { useParams } from 'react-router-dom';
import { useState } from 'react';
import SlideEditor from '../components/SlideEditor';
import SlideCreation from '../components/SlideCreation';

export default function ProjectPage() {
  const { id } = useParams();
  const [code, setCode] = useState<{ html: string; css: string; js: string } | null>(null);

  const handleGenerate = (html: string, css: string, js: string) => {
    setCode({ html, css, js });
  };

  const handleBack = () => {
    setCode(null);
  };

  if (!code) {
    return <SlideCreation onGenerate={handleGenerate} projectId={id} />;
  }

  return <SlideEditor initialCode={code} onBack={handleBack} projectId={id} />;
}
