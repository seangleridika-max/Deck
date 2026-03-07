import { nanoid } from 'nanoid';
import { Env } from '../types';

export const handleAuth = {
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

    const token = await generateJWT({ userId, email }, env.DECK_TOKEN);

    return Response.json({ userId, token }, { status: 201 });
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

    const token = await generateJWT({ userId: user.id as string, email: user.email as string }, env.DECK_TOKEN);

    return Response.json({
      token,
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

async function generateJWT(payload: { userId: string; email: string }, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = { ...payload, iat: now, exp: now + 86400 };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));
  const signature = await sign(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function verifyJWT(token: string, secret: string): Promise<{ userId: string; email: string } | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`, secret);

  if (signature !== expectedSignature) return null;

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return { userId: payload.userId, email: payload.email };
}

async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}
