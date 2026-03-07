import { nanoid } from 'nanoid';
import { Env } from '../types';

export const handleUsers = {
  async register(request: Request, env: Env) {
    const { email, password, name } = await request.json();

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
    const { email, password } = await request.json();

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
  },

  async getProfile(userId: string, env: Env) {
    const user = await env.DECK_DB.prepare(
      'SELECT id, email, name, created_at FROM users WHERE id = ?'
    ).bind(userId).first();

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at
    });
  },

  async getStats(userId: string, env: Env) {
    const result = await env.DECK_DB.prepare(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active FROM projects WHERE user_id = ?'
    ).bind(userId).first();

    return Response.json({
      projectCount: result?.total || 0,
      activeProjects: result?.active || 0
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
