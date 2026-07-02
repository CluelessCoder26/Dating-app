import { useEffect, useCallback } from 'react';
import { analytics } from '../services/telemetry/analytics.service';
import { monitoring } from '../services/telemetry/monitoring.service';

/**
 * React hook for tracking user journeys and events easily within components.
 */
const useTracking = (screenName = 'Unknown Screen') => {
  useEffect(() => {
    // Track screen view on mount
    analytics.track('Screen View', { screenName });
  }, [screenName]);

  const trackAction = useCallback((actionName, properties = {}) => {
    analytics.track(actionName, { ...properties, screenName });
  }, [screenName]);

  const trackError = useCallback((error, actionContext) => {
    monitoring.captureError(error, { screenName, actionContext });
  }, [screenName]);

  const trackSwipe = useCallback((direction, targetUserId) => {
    analytics.trackSwipe(direction, targetUserId);
    analytics.track('Swipe Action UI', { direction, screenName });
  }, [screenName]);

  return {
    trackAction,
    trackError,
    trackSwipe,
    analytics,
    monitoring,
  };
};

export default useTracking;
