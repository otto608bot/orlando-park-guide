"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

export default function TallyNewsletter() {
  useEffect(() => {
    // Load Tally embed script
    const existingScript = document.querySelector('script[src="https://tally.so/widgets/widget.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://tally.so/widgets/widget.js";
      script.async = true;
      script.onload = () => {
        window.Tally?.loadEmbeds();
      };
      document.body.appendChild(script);
    } else {
      window.Tally?.loadEmbeds();
    }
  }, []);

  return (
    <div className="tally-embed-wrapper">
      <iframe
        src="https://tally.so/embed/zxJ0zM?hide-title=true&transparent-background=true&align-left=true"
        loading="lazy"
        width="100%"
        height="180"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Subscribe to Plan Your Park"
      />
    </div>
  );
}
