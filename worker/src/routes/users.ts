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

  async getProfile(request: Request, env: Env) {
    const userId = (request as any).userId;

    const user = await env.DECK_DB.prepare(
      'SELECT id, email, name, created_at FROM users WHERE id = ?'
    ).bind(userId).first();

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json(user);
  },

  async updateProfile(request: Request, env: Env) {
    const userId = (request as any).userId;
    const { name, email } = await request.json();

    if (!name && !email) {
      return Response.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    values.push(userId);

    await env.DECK_DB.prepare(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    return Response.json({ success: true });
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
