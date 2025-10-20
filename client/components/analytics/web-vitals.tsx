'use client';

/**
 * Web Vitals Tracking Component
 * Tracks Core Web Vitals for performance monitoring
 */

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ðŸ“Š Web Vital:', metric);
    }

    if (process.env.NODE_ENV === 'production') {
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
        gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }

      sendToAnalytics(metric);
    }
  });

  return null;
}

/**
 * Send metrics to custom analytics endpoint
 */
async function sendToAnalytics(metric: { name: string; value: number; rating: string; delta: number; id: string; navigationType: string }) {
  try {
    JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error('Failed to send Web Vitals:', error);
  }
}

/**
 * Performance Observer for custom metrics
 */
export function usePerformanceObserver() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn('âš ï¸ Long Task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      }
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch {
    }

    return () => {
      longTaskObserver.disconnect();
    };
  }, []);
}
