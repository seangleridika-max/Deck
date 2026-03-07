import { nanoid } from 'nanoid';
import { Env } from '../types';

export const handleConversations = {
  async create(request: Request, env: Env) {
    const { sessionId } = await request.json();
    const conversationId = nanoid();

    await env.DECK_DB.prepare(
      'INSERT INTO conversations (id, session_id) VALUES (?, ?)'
    ).bind(conversationId, sessionId).run();

    return Response.json({ conversationId }, { status: 201 });
  },

  async stream(request: Request, env: Env) {
    const url = new URL(request.url);
    const conversationId = url.pathname.split('/').pop();
    const { message } = await request.json();

    // Save user message
    await env.DECK_DB.prepare(
      'INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)'
    ).bind(conversationId, 'user', message).run();

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // Start streaming response
    (async () => {
      try {
        // Simulate AI response streaming
        const response = `This is a streaming response to: ${message}`;
        let fullContent = '';

        for (let i = 0; i < response.length; i++) {
          const chunk = response[i];
          fullContent += chunk;

          await writer.write(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Save assistant message
        await env.DECK_DB.prepare(
          'INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)'
        ).bind(conversationId, 'assistant', fullContent).run();

        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`));
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  },

  async getMessages(request: Request, env: Env) {
    const url = new URL(request.url);
    const conversationId = url.pathname.split('/')[2];

    const { results } = await env.DECK_DB.prepare(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
    ).bind(conversationId).all();

    return Response.json({ messages: results });
  }
};
