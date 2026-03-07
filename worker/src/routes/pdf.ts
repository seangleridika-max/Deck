import { getDocument } from 'pdfjs-dist';
import { nanoid } from 'nanoid';
import { Env } from '../types';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const handlePdf = {
  async extract(request: Request, env: Env) {
    const formData = await request.formData();
    const fileEntry = formData.get('file');
    const projectId = formData.get('projectId');

    if (!fileEntry || typeof fileEntry === 'string' || !projectId || typeof projectId !== 'string') {
      return Response.json({ error: 'Missing file or projectId' }, { status: 400 });
    }

    const file = fileEntry as File;

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: 'File exceeds 50MB limit' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: buffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      // Group text items by Y position to preserve table structure
      const lines: Map<number, string[]> = new Map();

      content.items.forEach((item: any) => {
        const y = Math.round(item.transform[5]);
        if (!lines.has(y)) lines.set(y, []);
        lines.get(y)!.push(item.str);
      });

      // Sort by Y position and join
      const sortedLines = Array.from(lines.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([_, texts]) => texts.join(' '));

      fullText += sortedLines.join('\n') + '\n\n';
    }

    const sourceId = nanoid();
    await env.DECK_DB.prepare(
      'INSERT INTO sources (id, projectId, type, content, createdAt) VALUES (?, ?, ?, ?, ?)'
    ).bind(sourceId, projectId, 'pdf', fullText.trim(), new Date().toISOString()).run();

    return Response.json({ id: sourceId, content: fullText.trim() });
  }
};
