export class BillingProvider {
  constructor(name) {
    this.name = name;
  }

  async createSubscription(userId, planId) {
    throw new Error('Method not implemented.');
  }

  async cancelSubscription(subscriptionId) {
    throw new Error('Method not implemented.');
  }

  async processPayment(userId, amount, currency) {
    throw new Error('Method not implemented.');
  }
}
