import { Env } from '../types';
import { verifyJWT } from '../routes/auth';

export async function authMiddleware(request: Request, env: Env) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const payload = await verifyJWT(token, env.DECK_TOKEN);

  if (!payload) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  (request as Request & { user: { userId: string; email: string } }).user = payload;
}
