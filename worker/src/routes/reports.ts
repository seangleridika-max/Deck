import { nanoid } from 'nanoid';
import { Env } from '../types';

export const handleReports = {
  async generate(request: Request, env: Env) {
    const url = new URL(request.url);
    const projectId = url.pathname.split('/')[2];

    const project = await env.DECK_DB.prepare(
      'SELECT * FROM projects WHERE id = ?'
    ).bind(projectId).first();

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    const sources = await env.DECK_DB.prepare(
      'SELECT * FROM sources WHERE project_id = ?'
    ).bind(projectId).all();

    const logs = await env.DECK_DB.prepare(
      'SELECT * FROM research_logs WHERE project_id = ? ORDER BY created_at'
    ).bind(projectId).all();

    const markdown = `# ${project.title}

## Project Information
- **Created**: ${project.created_at}
- **Status**: ${project.status}

## Sources
${sources.results.map((s: any) => `- [${s.type}] ${s.title || s.url || 'Untitled'}`).join('\n')}

## Research Summary
${logs.results.map((l: any) => `**${l.role}**: ${l.content}`).join('\n\n')}
`;

    const filename = `report-${projectId}-${Date.now()}.md`;
    const r2Key = `reports/${projectId}/${filename}`;

    await env.DECK_ASSETS.put(r2Key, markdown, {
      httpMetadata: { contentType: 'text/markdown' }
    });

    const result = await env.DECK_DB.prepare(
      'INSERT INTO assets (project_id, type, filename, r2_key, size, content_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id'
    ).bind(
      projectId,
      'report',
      filename,
      r2Key,
      markdown.length,
      'text/markdown',
      new Date().toISOString()
    ).first();

    if (!result) {
      return Response.json({ error: 'Failed to create report' }, { status: 500 });
    }

    return Response.json({
      reportId: (result as any).id,
      downloadUrl: `/projects/${projectId}/reports/${(result as any).id}/download`
    }, { status: 201 });
  }
};
