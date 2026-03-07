import { nanoid } from 'nanoid';
import { Env } from '../types';

export const handleProjects = {
  async create(request: Request, env: Env) {
    const body = (await request.json()) as { title: string; skillId?: string };
    const { title, skillId } = body;
    const userId = request.headers.get('X-User-Id');

    const projectId = nanoid();
    const now = new Date().toISOString();

    await env.DECK_DB.prepare(
      'INSERT INTO projects (id, user_id, title, skill_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(projectId, userId, title, skillId || null, 'active', now, now).run();

    return Response.json({ projectId }, { status: 201 });
  },

  async list(request: Request, env: Env) {
    const userId = request.headers.get('X-User-Id');
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'active';

    const { results } = await env.DECK_DB.prepare(
      'SELECT * FROM projects WHERE user_id = ? AND status = ? ORDER BY updated_at DESC'
    ).bind(userId, status).all();

    return Response.json({ projects: results });
  },

  async get(request: Request, env: Env) {
    const url = new URL(request.url);
    const projectId = url.pathname.split('/').pop();

    const project = await env.DECK_DB.prepare(
      'SELECT * FROM projects WHERE id = ?'
    ).bind(projectId).first();

    if (!project) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json({ project });
  }
};
