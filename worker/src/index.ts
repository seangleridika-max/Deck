import { Router } from 'itty-router';
import { Env } from './types';
import { corsHeaders } from './utils/cors';
import { authMiddleware } from './middleware/auth';
import { handleUsers } from './routes/users';
import { handleProjects } from './routes/projects';

const router = Router();

// 健康检查
router.get('/health', () => {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 用户路由
router.post('/users', handleUsers.register);
router.post('/users/login', handleUsers.login);
router.get('/users/profile', authMiddleware, handleUsers.getProfile);
router.put('/users/profile', authMiddleware, handleUsers.updateProfile);

// 项目路由（需要认证）
router.get('/projects', authMiddleware, handleProjects.list);
router.post('/projects', authMiddleware, handleProjects.create);
router.get('/projects/:id', authMiddleware, handleProjects.get);

// 404处理
router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const response = await router.handle(request, env);

      // 添加CORS头
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        headers
      });
    } catch (error) {
      console.error('Worker error:', error);
      return Response.json(
        { error: 'Internal server error' },
        { status: 500, headers: corsHeaders }
      );
    }
  }
};
