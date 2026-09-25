'use client';

import { useEffect } from 'react';

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

/** Records which existing park-fit starting point families choose on /parks. */
export default function ParksDecisionTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('[data-decision-cta]');
      if (!link || !window.gtag) return;

      window.gtag('event', 'park_decision_click', {
        page_path: window.location.pathname,
        decision_choice: link.dataset.decisionChoice || 'unknown',
        destination_path: new URL(link.href).pathname,
        link_text: (link.textContent || '').trim().slice(0, 120),
      });
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
