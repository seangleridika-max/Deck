import { Source } from '../types';

interface AggregatedContext {
  content: string;
  sources: Array<{ id: string; type: string; title?: string }>;
  tokenCount: number;
  truncated: boolean;
}

const CHARS_PER_TOKEN = 4;
const DEFAULT_MAX_TOKENS = 100000;

export function aggregateSources(
  sources: Source[],
  maxTokens: number = DEFAULT_MAX_TOKENS
): AggregatedContext {
  const maxChars = maxTokens * CHARS_PER_TOKEN;
  let totalChars = 0;
  let truncated = false;
  const parts: string[] = [];
  const includedSources: Array<{ id: string; type: string; title?: string }> = [];

  for (const source of sources) {
    const header = `\n\n--- Source: ${source.type.toUpperCase()} ${source.title || source.id} ---\n`;
    const content = source.content || '';
    const sourceBlock = header + content;

    if (totalChars + sourceBlock.length > maxChars) {
      const remaining = maxChars - totalChars;
      if (remaining > header.length + 100) {
        parts.push(header + content.substring(0, remaining - header.length) + '\n[truncated]');
        includedSources.push({ id: source.id, type: source.type, title: source.title });
      }
      truncated = true;
      break;
    }

    parts.push(sourceBlock);
    includedSources.push({ id: source.id, type: source.type, title: source.title });
    totalChars += sourceBlock.length;
  }

  return {
    content: parts.join(''),
    sources: includedSources,
    tokenCount: Math.ceil(totalChars / CHARS_PER_TOKEN),
    truncated
  };
}
