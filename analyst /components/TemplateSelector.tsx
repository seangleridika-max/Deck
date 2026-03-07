import React from 'react';

export type ReportTemplate = 'professional' | 'compact' | 'detailed';

interface TemplateSelectorProps {
  selected: ReportTemplate;
  onChange: (template: ReportTemplate) => void;
  disabled?: boolean;
}

const templates: { id: ReportTemplate; name: string; description: string }[] = [
  { id: 'professional', name: 'Professional', description: 'Clean layout with emphasis on key metrics' },
  { id: 'compact', name: 'Compact', description: 'Dense information display for quick scanning' },
  { id: 'detailed', name: 'Detailed', description: 'Comprehensive view with expanded sections' },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selected, onChange, disabled }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-300">Report Template</label>
      <div className="flex gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onChange(template.id)}
            disabled={disabled}
            className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
              selected === template.id
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={template.description}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
