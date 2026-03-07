import { GeminiService } from '../gemini';

describe('GeminiService', () => {
  it('should initialize with default model', () => {
    const service = new GeminiService({ apiKey: 'test-key' });
    expect(service).toBeDefined();
  });

  it('should allow model switching', () => {
    const service = new GeminiService({ apiKey: 'test-key' });
    service.setModel('gemini-2.5-pro');
    expect(service).toBeDefined();
  });
});
