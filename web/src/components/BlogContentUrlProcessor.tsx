'use client';

import { useEffect, useRef } from 'react';

/**
 * Client-side component that post-processes rendered blog content
 * to convert any remaining plain-text URLs into clickable links.
 */
export default function BlogContentUrlProcessor({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Find all text nodes that contain URLs not already in href attributes
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text)) {
      textNodes.push(node);
    }

    // Process each text node for plain URLs
    textNodes.forEach((textNode) => {
      const text = textNode.textContent || '';
      // Match URLs that aren't already inside href attributes
      // Look for https:// or http:// URLs at word boundaries
      const urlRegex = /(?<!href=["'])\b(https?:\/\/[^\s<]+)/g;
      
      if (urlRegex.test(text)) {
        const parent = textNode.parentNode;
        if (!parent || parent.nodeName === 'A') return; // Already in a link
        
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        
        // Reset regex state
        urlRegex.lastIndex = 0;
        
        while ((match = urlRegex.exec(text)) !== null) {
          // Add text before the URL
          if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
          }
          
          // Add the URL as a link with clean display text
          const url = match[1];
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.className = 'inline-link';
          // Use clean display text for Amazon URLs, otherwise show clean truncated URL
          if (url.includes('amazon.com')) {
            link.textContent = 'Get it on Amazon';
          } else {
            // Truncate long URLs for display (e.g. URL parameters with tracking)
            try {
              const parsed = new URL(url);
              link.textContent = parsed.hostname + (parsed.pathname.length > 20 ? parsed.pathname.slice(0, 20) + '…' : parsed.pathname);
            } catch {
              link.textContent = url.length > 40 ? url.slice(0, 40) + '…' : url;
            }
          }
          fragment.appendChild(link);
          
          lastIndex = match.index + url.length;
        }
        
        // Add remaining text
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        
        // Replace the text node with the fragment
        parent.replaceChild(fragment, textNode);
      }
    });
  }, []);

  return (
    <div ref={containerRef} className="blog-content">
      {children}
    </div>
  );
}
