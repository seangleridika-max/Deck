import { nanoid } from 'nanoid';
import { Env } from '../types';
import PptxGenJS from 'pptxgenjs';

export const handleProjects = {
  async create(request: Request, env: Env) {
    const body = await request.json() as { title: string; skillId?: string };
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
  },

  async generateSlides(request: Request, env: Env) {
    const url = new URL(request.url);
    const projectId = url.pathname.split('/')[2];

    const project = await env.DECK_DB.prepare(
      'SELECT * FROM projects WHERE id = ?'
    ).bind(projectId).first() as { title: string } | null;

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();
    slide.addText(project.title || 'Untitled Project', { x: 1, y: 1, fontSize: 24, color: '363636' });

    const pptxData = await pptx.write({ outputType: 'arraybuffer' }) as ArrayBuffer;
    const filename = `${projectId}-${Date.now()}.pptx`;
    const r2Key = `slides/${filename}`;

    await env.DECK_ASSETS.put(r2Key, pptxData, {
      httpMetadata: { contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }
    });

    const now = new Date().toISOString();
    await env.DECK_DB.prepare(
      'INSERT INTO assets (project_id, type, filename, r2_key, size, content_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(projectId, 'slides', filename, r2Key, pptxData.byteLength, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', now).run();

    return Response.json({ downloadUrl: `/assets/${r2Key}` }, { status: 201 });
  }
};
