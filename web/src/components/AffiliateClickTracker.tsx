'use client';

import { useEffect } from 'react';

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

function destinationType(href: string): string {
  if (href.includes('amazon.com')) return 'amazon';
  if (href.includes('undercovertourist') || href.includes('dpbolvw.net') || href.includes('tkqlhce.com') || href.includes('anrdoezrs.net')) {
    return 'tickets';
  }
  if (href.includes('viator.com')) return 'marketplace';
  return 'sponsored_external';
}

export default function AffiliateClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[target="_blank"]');
      if (!link) return;

      const href = link.href;
      const sponsored = link.rel.includes('sponsored') || href.includes('amazon.com') || href.includes('dpbolvw.net') || href.includes('tkqlhce.com') || href.includes('anrdoezrs.net');
      if (!sponsored || !window.gtag) return;

      window.gtag('event', 'affiliate_click', {
        page_path: window.location.pathname,
        destination_type: destinationType(href),
        link_text: (link.textContent || '').trim().slice(0, 120),
        link_url: href,
      });
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
