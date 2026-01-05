/**
 * Lightweight Analytics Tracking
 * 
 * Privacy-friendly event tracking for calculator interactions
 * No PII collected, AdSense-safe (no ad-click tracking)
 * 
 * Can be integrated with:
 * - Self-hosted analytics (Plausible, Umami)
 * - Google Analytics 4 (if configured)
 * - Custom analytics endpoint
 */

export type AnalyticsEvent =
  | 'calculator_mode_change'
  | 'calculator_country_change'
  | 'calculator_calculate'
  | 'calculator_copy_link'
  | 'calculator_load_example'
  | 'guide_view'
  | 'page_view';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties?: Record<string, string | number | boolean>;
}

/**
 * Track analytics event
 * 
 * Privacy considerations:
 * - No PII (personally identifiable information)
 * - No ad-click tracking
 * - No user identification
 * - Only interaction events
 */
export function trackEvent(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') {
    return; // Server-side, skip
  }

  // Check if analytics is enabled (can be controlled via env var)
  const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'false';

  if (!analyticsEnabled) {
    return;
  }

  const eventData: AnalyticsEventData = {
    event,
    properties: {
      ...properties,
      timestamp: Date.now(),
    },
  };

  // Self-hosted analytics (Plausible example)
  if (typeof window.plausible === 'function') {
    window.plausible(event, { props: properties });
    return;
  }

  // Google Analytics 4 (if configured)
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, properties);
    return;
  }

  // Custom analytics endpoint (if configured)
  const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  if (analyticsEndpoint) {
    fetch(analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    }).catch(() => {
      // Silently fail - analytics should never break the app
    });
    return;
  }

  // Development: log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, properties);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string): void {
  trackEvent('page_view', { path });
}

/**
 * Track calculator mode change
 */
export function trackModeChange(mode: string, countryCode: string): void {
  trackEvent('calculator_mode_change', {
    mode,
    country: countryCode,
  });
}

/**
 * Track calculator country change
 */
export function trackCountryChange(countryCode: string): void {
  trackEvent('calculator_country_change', {
    country: countryCode,
  });
}

/**
 * Track calculation
 */
export function trackCalculate(countryCode: string, mode: string): void {
  trackEvent('calculator_calculate', {
    country: countryCode,
    mode,
  });
}

/**
 * Track copy share link
 */
export function trackCopyLink(countryCode: string): void {
  trackEvent('calculator_copy_link', {
    country: countryCode,
  });
}

/**
 * Track load example
 */
export function trackLoadExample(countryCode: string): void {
  trackEvent('calculator_load_example', {
    country: countryCode,
  });
}

/**
 * Push event to Google Tag Manager dataLayer
 */
export function pushToDataLayer(eventName: string, eventData?: Record<string, any>): void {
  if (typeof window === 'undefined') {
    return; // Server-side, skip
  }

  // Initialize dataLayer if it doesn't exist
  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  const eventPayload = {
    event: eventName,
    ...eventData,
  };

  // Push event to dataLayer
  window.dataLayer.push(eventPayload);
  
  // Console log for debugging
  console.log('[GTM DataLayer]', eventPayload);
}

/**
 * Track calculator started event (when user completes first field)
 */
export function trackCalcStarted(): void {
  pushToDataLayer('calc_started');
}

/**
 * Track calculator finished event (when calculation completes successfully)
 */
export function trackCalcFinished(taxresidence: string): void {
  pushToDataLayer('calc_finished', {
    taxresidence,
  });
}

// TypeScript declarations for analytics libraries
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void;
    dataLayer?: Array<Record<string, any>>;
  }
}

