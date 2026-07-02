export class VisionProvider {
  constructor(name) {
    this.name = name;
  }

  async analyzeImage(buffer, options = {}) {
    throw new Error('VisionProvider.analyzeImage() not implemented');
  }
}
