export class EmbeddingProvider {
  constructor(name) {
    this.name = name;
  }

  async embed(text) {
    throw new Error('EmbeddingProvider.embed() not implemented');
  }

  async embedBatch(texts) {
    throw new Error('EmbeddingProvider.embedBatch() not implemented');
  }
}
