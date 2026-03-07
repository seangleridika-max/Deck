import { useState, useEffect, useRef } from 'react';
import { SSEClient, conversationAPI } from '../services/sse';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ConversationPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [streaming, setStreaming] = useState(false);
  const sseClient = useRef(new SSEClient());

  useEffect(() => {
    conversationAPI.create('default-session').then(res => {
      setConversationId(res.data.conversationId);
    });

    const client = sseClient.current;
    return () => client.disconnect();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId || streaming) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setStreaming(true);

    let assistantContent = '';
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    sseClient.current.sendMessage(
      conversationId,
      userMessage,
      (chunk) => {
        assistantContent += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
          return updated;
        });
      },
      () => setStreaming(false),
      (error) => {
        console.error(error);
        setStreaming(false);
      }
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>Conversation</h1>
      <div style={{ border: '1px solid #ccc', padding: 10, minHeight: 400, marginBottom: 20 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 10, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block',
              padding: 10,
              background: msg.role === 'user' ? '#007bff' : '#f1f1f1',
              color: msg.role === 'user' ? 'white' : 'black',
              borderRadius: 8
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 10 }}
          disabled={streaming}
        />
        <button onClick={sendMessage} disabled={streaming || !input.trim()}>
          {streaming ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
