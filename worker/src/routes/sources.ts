import { nanoid } from 'nanoid';
import { Env } from '../types';

export const handleSources = {
  async list(request: Request, env: Env) {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    if (!projectId) {
      return Response.json({ error: 'projectId required' }, { status: 400 });
    }

    const { results } = await env.DECK_DB.prepare(
      'SELECT * FROM sources WHERE project_id = ? ORDER BY created_at DESC'
    ).bind(projectId).all();

    return Response.json({ sources: results });
  },

  async create(request: Request, env: Env) {
    const { projectId, type, url, title, content } = await request.json();

    if (!projectId || !type) {
      return Response.json({ error: 'projectId and type required' }, { status: 400 });
    }

    const id = nanoid();
    const now = new Date().toISOString();

    await env.DECK_DB.prepare(
      'INSERT INTO sources (id, project_id, type, url, title, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(id, projectId, type, url || null, title || null, content || null, now).run();

    return Response.json({ id }, { status: 201 });
  },

  async delete(request: Request, env: Env) {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    await env.DECK_DB.prepare('DELETE FROM sources WHERE id = ?').bind(id).run();

    return Response.json({ success: true });
  }
};
