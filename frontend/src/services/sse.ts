import api from './api';

export class SSEClient {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  async sendMessage(
    conversationId: string,
    message: string,
    onChunk: (content: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ) {
    try {
      const token = this.getToken();
      const url = `${api.defaults.baseURL}/conversations/${conversationId}/stream`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) throw new Error('Stream failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader');

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              this.reconnectAttempts = 0;
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                onError(parsed.error);
              } else if (parsed.content) {
                onChunk(parsed.content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      this.handleReconnect(conversationId, message, onChunk, onComplete, onError);
    }
  }

  private handleReconnect(
    conversationId: string,
    message: string,
    onChunk: (content: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.sendMessage(conversationId, message, onChunk, onComplete, onError);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      onError('Connection failed after multiple attempts');
    }
  }

  private getToken(): string {
    const token = localStorage.getItem('deck-auth');
    if (token) {
      const { state } = JSON.parse(token);
      return state.token || '';
    }
    return '';
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export const conversationAPI = {
  create: (sessionId: string) => api.post('/conversations', { sessionId }),
  getMessages: (id: string) => api.get(`/conversations/${id}/messages`)
};
