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

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>
): void {
  if (typeof window === 'undefined') {
    return;
  }

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

  if (typeof window.plausible === 'function') {
    window.plausible(event, { props: properties });
    return;
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, properties);
    return;
  }

  const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  if (analyticsEndpoint) {
    fetch(analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    }).catch(() => {});
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event, properties);
  }
}

export function trackPageView(path: string): void {
  trackEvent('page_view', { path });
}

export function trackModeChange(mode: string, countryCode: string): void {
  trackEvent('calculator_mode_change', {
    mode,
    country: countryCode,
  });
}

export function trackCountryChange(countryCode: string): void {
  trackEvent('calculator_country_change', {
    country: countryCode,
  });
}

export function trackCalculate(countryCode: string, mode: string): void {
  trackEvent('calculator_calculate', {
    country: countryCode,
    mode,
  });
}

export function trackCopyLink(countryCode: string): void {
  trackEvent('calculator_copy_link', {
    country: countryCode,
  });
}

export function trackLoadExample(countryCode: string): void {
  trackEvent('calculator_load_example', {
    country: countryCode,
  });
}

export function pushToDataLayer(eventName: string, eventData?: Record<string, any>): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  const eventPayload = {
    event: eventName,
    ...eventData,
  };

  window.dataLayer.push(eventPayload);
  console.log('[GTM DataLayer]', eventPayload);
}

export function trackCalcStarted(): void {
  pushToDataLayer('calc_started');
}

export function trackCalcFinished(taxresidence: string): void {
  pushToDataLayer('calc_finished', {
    taxresidence,
  });
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void;
    dataLayer?: Array<Record<string, any>>;
  }
}
