import { nanoid } from 'nanoid';
import { Env } from '../types';

export const handleSources = {
  async create(request: Request, env: Env) {
    const url = new URL(request.url);
    const projectId = url.pathname.split('/')[2];

    const { type, url: sourceUrl, title, content } = await request.json() as {
      type: string;
      url?: string;
      title?: string;
      content?: string;
    };

    if (!['url', 'pdf', 'video', 'text'].includes(type)) {
      return Response.json({ error: 'Invalid type' }, { status: 400 });
    }

    const sourceId = nanoid();
    const now = new Date().toISOString();

    await env.DECK_DB.prepare(
      'INSERT INTO sources (id, project_id, type, url, title, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(sourceId, projectId, type, sourceUrl || null, title || null, content || null, now).run();

    return Response.json({ sourceId }, { status: 201 });
  }
};
