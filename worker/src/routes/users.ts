import { nanoid } from 'nanoid';
import { Env } from '../types';

export const handleUsers = {
  async register(request: Request, env: Env) {
    const body = await request.json() as any;
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    const userId = nanoid();
    const passwordHash = await hashPassword(password);

    await env.DECK_DB.prepare(
      'INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, email, name, passwordHash, new Date().toISOString()).run();

    return Response.json({ userId }, { status: 201 });
  },

  async login(request: Request, env: Env) {
    const body = await request.json() as any;
    const { email, password } = body;

    const user = await env.DECK_DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user || !(await verifyPassword(password, user.password_hash as string))) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return Response.json({
      token: env.DECK_TOKEN,
      userId: user.id
    });
  }
};

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return (await hashPassword(password)) === hash;
}
