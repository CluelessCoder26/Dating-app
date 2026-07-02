export class ModerationProvider {
  constructor(name) {
    this.name = name;
  }

  async moderate(content) {
    throw new Error('ModerationProvider.moderate() not implemented');
  }
}
