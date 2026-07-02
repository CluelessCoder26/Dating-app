import crypto from 'crypto';
import { BillingProvider } from './BillingProvider.js';

export class MockBillingProvider extends BillingProvider {
  constructor() {
    super('mock');
  }

  async createSubscription(userId, planId) {
    return {
      providerSubscriptionId: `sub_mock_${crypto.randomUUID()}`,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
  }

  async cancelSubscription(subscriptionId) {
    return {
      status: 'canceled',
      cancelAtPeriodEnd: true
    };
  }

  async processPayment(userId, amount, currency) {
    return {
      providerTransactionId: `txn_mock_${crypto.randomUUID()}`,
      status: 'SUCCESS'
    };
  }
}
