import { EmbeddingProvider } from './EmbeddingProvider.js';

export class MockEmbeddingProvider extends EmbeddingProvider {
  constructor() {
    super('mock');
  }

  async embed(text) {
    const vector = Array.from({ length: 384 }, (_, i) => {
      const charCode = text.charCodeAt(i % text.length) || 0;
      return parseFloat(((charCode / 255) * 2 - 1).toFixed(6));
    });
    return { vector, model: 'mock-embed-v1', dimensions: 384 };
  }

  async embedBatch(texts) {
    return Promise.all(texts.map(t => this.embed(t)));
  }
}
