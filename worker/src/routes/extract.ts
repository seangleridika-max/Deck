import { IRequest } from 'itty-router';
import { Env } from '../types';
import { extractContent } from '../services/extractor';

export const handleExtract = {
  async extract(request: IRequest, env: Env) {
    try {
      const { url } = await request.json() as { url: string };

      if (!url) {
        return Response.json({ error: 'URL is required' }, { status: 400 });
      }

      const result = await extractContent(url);
      return Response.json(result);
    } catch (error) {
      console.error('Extract error:', error);
      return Response.json(
        { error: error instanceof Error ? error.message : 'Extraction failed' },
        { status: 500 }
      );
    }
  }
};
