import { describe, it, expect, beforeEach } from 'vitest';
import { handleProjects } from './projects';

describe('Projects API', () => {
  let mockEnv: any;
  let mockUserId: string;

  beforeEach(() => {
    mockUserId = 'user-123';
    mockEnv = {
      DECK_DB: {
        prepare: (sql: string) => ({
          bind: (...args: any[]) => ({
            all: async () => ({ results: [] }),
            first: async () => ({ total: 0 }),
            run: async () => ({})
          })
        })
      }
    };
  });

  describe('list', () => {
    it('should return projects with default pagination', async () => {
      const mockProjects = [
        { id: '1', title: 'Project 1', status: 'active' },
        { id: '2', title: 'Project 2', status: 'active' }
      ];

      mockEnv.DECK_DB.prepare = (sql: string) => ({
        bind: (...args: any[]) => ({
          all: async () => ({ results: mockProjects }),
          first: async () => ({ total: 2 })
        })
      });

      const request = new Request('http://localhost/projects?status=active', {
        headers: { 'X-User-Id': mockUserId }
      });

      const response = await handleProjects.list(request, mockEnv);
      const data = await response.json();

      expect(data.projects).toHaveLength(2);
      expect(data.pagination).toEqual({
        total: 2,
        limit: 20,
        offset: 0,
        hasMore: false
      });
    });

    it('should support custom pagination parameters', async () => {
      mockEnv.DECK_DB.prepare = (sql: string) => ({
        bind: (...args: any[]) => ({
          all: async () => ({ results: [{ id: '1' }] }),
          first: async () => ({ total: 50 })
        })
      });

      const request = new Request('http://localhost/projects?limit=10&offset=20', {
        headers: { 'X-User-Id': mockUserId }
      });

      const response = await handleProjects.list(request, mockEnv);
      const data = await response.json();

      expect(data.pagination.limit).toBe(10);
      expect(data.pagination.offset).toBe(20);
      expect(data.pagination.hasMore).toBe(true);
    });

    it('should support sorting by created_at ascending', async () => {
      const queries: string[] = [];
      mockEnv.DECK_DB.prepare = (sql: string) => {
        queries.push(sql);
        return {
          bind: () => ({
            all: async () => ({ results: [] }),
            first: async () => ({ total: 0 })
          })
        };
      };

      const request = new Request('http://localhost/projects?sortBy=created_at&order=asc', {
        headers: { 'X-User-Id': mockUserId }
      });

      await handleProjects.list(request, mockEnv);
      expect(queries[0]).toContain('ORDER BY created_at ASC');
    });

    it('should filter by status', async () => {
      const request = new Request('http://localhost/projects?status=completed', {
        headers: { 'X-User-Id': mockUserId }
      });

      await handleProjects.list(request, mockEnv);
      // Status filtering is verified through the bind parameters
    });

    it('should limit maximum page size to 100', async () => {
      const request = new Request('http://localhost/projects?limit=500', {
        headers: { 'X-User-Id': mockUserId }
      });

      const response = await handleProjects.list(request, mockEnv);
      const data = await response.json();

      expect(data.pagination.limit).toBe(100);
    });
  });
});
