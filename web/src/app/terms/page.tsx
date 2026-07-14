import ContentPageShell from "@/components/ContentPageShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms of Use",
  description: "Read the Plan Your Park terms covering site use, informational content, and affiliate relationships.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <ContentPageShell
      title="Terms of Use"
      intro="By using Plan Your Park, you agree to use the site for informational purposes and to evaluate travel decisions with your own judgment."
    >
      <section>
        <h2>Informational use</h2>
        <p>
          Plan Your Park provides general planning information, not legal, medical, accessibility, or travel-agent advice. Theme park details can change without notice.
        </p>
      </section>

      <section>
        <h2>Accuracy</h2>
        <p>
          We try to keep ride, dining, pricing, and planning details current, but you should always confirm final details with the official park or ticket provider before making purchase decisions.
        </p>
      </section>

      <section>
        <h2>Affiliate relationships</h2>
        <p>
          Some links may generate commissions for Plan Your Park. Those relationships do not change the price you pay, but they do support the site.
        </p>
      </section>
    </ContentPageShell>
  );
}
