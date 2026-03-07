import { Env } from '../types';

export const handleConversations = {
  async create(request: Request, env: Env) {
    const body = await request.json() as any;
    const { projectId, role, content, metadata } = body;

    if (!projectId || !role || !content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await env.DECK_DB.prepare(
      'INSERT INTO research_logs (project_id, role, content, metadata) VALUES (?, ?, ?, ?)'
    ).bind(projectId, role, content, metadata || null).run();

    return Response.json({ id: result.meta.last_row_id }, { status: 201 });
  },

  async list(request: Request, env: Env) {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');

    if (!projectId) {
      return Response.json({ error: 'projectId required' }, { status: 400 });
    }

    const { results } = await env.DECK_DB.prepare(
      'SELECT * FROM research_logs WHERE project_id = ? ORDER BY created_at ASC'
    ).bind(projectId).all();

    return Response.json({ conversations: results });
  }
};
