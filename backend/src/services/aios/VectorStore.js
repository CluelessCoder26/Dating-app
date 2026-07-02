export class VectorStore {
  constructor(name) {
    this.name = name;
  }

  async upsert(id, vector, metadata = {}) {
    throw new Error('VectorStore.upsert() not implemented');
  }

  async query(vector, topK = 10) {
    throw new Error('VectorStore.query() not implemented');
  }

  async delete(id) {
    throw new Error('VectorStore.delete() not implemented');
  }
}
