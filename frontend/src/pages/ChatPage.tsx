import { useState } from 'react';
import MessageList from '../components/MessageList';
import ChatInput from '../components/ChatInput';

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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSend = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      sources: []
    };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ message: content })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const result = await reader.read();
        done = result.done;
        if (done) break;
        const value = result.value;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.content) {
              setMessages(prev => prev.map(m =>
                m.id === assistantMsg.id
                  ? { ...m, content: m.content + data.content }
                  : m
              ));
            }

            if (data.sources) {
              setMessages(prev => prev.map(m =>
                m.id === assistantMsg.id
                  ? { ...m, sources: data.sources }
                  : m
              ));
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      setMessages(prev => prev.map(m =>
        m.id === assistantMsg.id
          ? { ...m, content: '错误：无法连接到服务器' }
          : m
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSourceClick = (source: Source) => {
    if (source.url) {
      window.open(source.url, '_blank');
    } else {
      alert(`来源: ${source.title}`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow px-6 py-4">
        <h1 className="text-xl font-bold">AI 对话研究</h1>
      </header>
      <MessageList messages={messages} onSourceClick={handleSourceClick} />
      <ChatInput onSend={handleSend} disabled={isStreaming} />
    </div>
  );
}

function getToken(): string {
  const stored = localStorage.getItem('deck-auth');
  if (stored) {
    const { state } = JSON.parse(stored);
    return state.token || '';
  }
  return '';
}
