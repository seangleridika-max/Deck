import { nanoid } from 'nanoid';
import { Env } from '../types';

export const handleProjects = {
  async create(request: Request, env: Env) {
    const { title, skillId } = await request.json();
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
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const sortBy = url.searchParams.get('sortBy') || 'updated_at';
    const order = url.searchParams.get('order') === 'asc' ? 'ASC' : 'DESC';

    const allowedSortFields = ['created_at', 'updated_at', 'title'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'updated_at';

    const { results } = await env.DECK_DB.prepare(
      `SELECT * FROM projects WHERE user_id = ? AND status = ? ORDER BY ${sortField} ${order} LIMIT ? OFFSET ?`
    ).bind(userId, status, limit, offset).all();

    const { total } = await env.DECK_DB.prepare(
      'SELECT COUNT(*) as total FROM projects WHERE user_id = ? AND status = ?'
    ).bind(userId, status).first() as { total: number };

    return Response.json({
      projects: results,
      pagination: { total, limit, offset, hasMore: offset + results.length < total }
    });
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
