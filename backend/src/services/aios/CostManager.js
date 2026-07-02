class CostManager {
  constructor() {
    this.pricing = {
      'mock-gpt-4': { input: 0.0, output: 0.0 },
      'gpt-4o': { input: 0.005, output: 0.015 },
      'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
      'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
      'claude-3.5-sonnet': { input: 0.003, output: 0.015 }
    };
  }

  calculateCost(model, promptTokens, responseTokens) {
    const pricing = this.pricing[model] || { input: 0, output: 0 };
    return (promptTokens / 1000 * pricing.input) + (responseTokens / 1000 * pricing.output);
  }
}

export const costManager = new CostManager();
