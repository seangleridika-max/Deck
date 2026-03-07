import { describe, it, expect } from 'vitest';
import { aggregateSources } from './sourceAggregator';
import { Source } from '../types';

describe('aggregateSources', () => {
  it('aggregates multiple sources with attribution', () => {
    const sources: Source[] = [
      { id: '1', projectId: 'p1', type: 'url', title: 'Article 1', content: 'Content 1', createdAt: '2026-01-01' },
      { id: '2', projectId: 'p1', type: 'pdf', title: 'Doc 2', content: 'Content 2', createdAt: '2026-01-02' }
    ];

    const result = aggregateSources(sources);

    expect(result.sources).toHaveLength(2);
    expect(result.content).toContain('--- Source: URL Article 1 ---');
    expect(result.content).toContain('Content 1');
    expect(result.content).toContain('--- Source: PDF Doc 2 ---');
    expect(result.content).toContain('Content 2');
    expect(result.truncated).toBe(false);
  });

  it('respects token limits', () => {
    const sources: Source[] = [
      { id: '1', projectId: 'p1', type: 'text', content: 'a'.repeat(1000), createdAt: '2026-01-01' },
      { id: '2', projectId: 'p1', type: 'text', content: 'b'.repeat(1000), createdAt: '2026-01-02' }
    ];

    const result = aggregateSources(sources, 100);

    expect(result.truncated).toBe(true);
    expect(result.tokenCount).toBeLessThanOrEqual(100);
  });

  it('handles empty sources', () => {
    const result = aggregateSources([]);

    expect(result.sources).toHaveLength(0);
    expect(result.content).toBe('');
    expect(result.tokenCount).toBe(0);
    expect(result.truncated).toBe(false);
  });
});
