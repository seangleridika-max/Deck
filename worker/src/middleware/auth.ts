import { Env } from '../types';

export async function authMiddleware(request: Request, env: Env) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7);

  // 验证Token（简化版，实际应验证JWT）
  if (token !== env.DECK_TOKEN) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }
}
