/**
 * Monitoring and error tracking abstraction layer.
 * Decouples the app from specific tools (e.g., Sentry, Datadog).
 */

class MonitoringService {
  constructor() {
    this.initialized = false;
  }

  init(config) {
    // In a real scenario, initialize Sentry or similar SDKs here
    this.initialized = true;
    console.log('[Monitoring] Initialized with config:', config);
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.captureError(event.error || new Error(event.message), {
          context: 'Global Window Error',
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(event.reason, {
          context: 'Unhandled Promise Rejection',
        });
      });
    }
  }

  captureError(error, extraParams = {}) {
    if (!this.initialized) {
      console.error('[Monitoring: Disabled] Error captured:', error, extraParams);
      return;
    }
    
    // send to Sentry/Datadog etc.
    // e.g., Sentry.captureException(error, { extra: extraParams });
    console.error('[Monitoring] Captured Error:', error, extraParams);
  }

  captureMessage(message, level = 'info', extraParams = {}) {
    if (!this.initialized) return;
    
    // e.g., Sentry.captureMessage(message, level)
    console.log(`[Monitoring] ${level.toUpperCase()}: ${message}`, extraParams);
  }

  /**
   * Capture API failures
   */
  captureApiError(error, endpoint, method = 'GET') {
    this.captureError(error, { endpoint, method, context: 'API Request' });
  }

  /**
   * Capture React component errors (ErrorBoundary)
   */
  captureReactError(error, errorInfo) {
    this.captureError(error, { reactErrorInfo: errorInfo, context: 'React Error Boundary' });
  }
}

export const monitoring = new MonitoringService();
