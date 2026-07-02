export class LLMProvider {
  constructor(name) {
    this.name = name;
  }

  async complete(messages, options = {}) {
    throw new Error('LLMProvider.complete() not implemented');
  }

  async stream(messages, options = {}) {
    throw new Error('LLMProvider.stream() not implemented');
  }
}
