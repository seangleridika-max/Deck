import { useRef, useEffect } from 'react';

interface Source {
  id: string;
  title: string;
  url?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

interface MessageListProps {
  messages: Message[];
  onSourceClick?: (source: Source) => void;
}

export default function MessageList({ messages, onSourceClick }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-3xl rounded-lg p-4 ${
            msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}>
            <div className="whitespace-pre-wrap">{msg.content}</div>
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-300 space-y-1">
                {msg.sources.map((src) => (
                  <button
                    key={src.id}
                    onClick={() => onSourceClick?.(src)}
                    className="block text-sm text-blue-600 hover:underline"
                  >
                    📎 {src.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
