declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", name, params);
  window.clarity?.("event", name);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) window.clarity?.("set", key, String(value));
  });
}
