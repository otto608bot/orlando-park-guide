import ContentPageShell from "@/components/ContentPageShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Affiliate Disclosure",
  description: "Read the Plan Your Park affiliate disclosure for ticket, travel gear, and partner links.",
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <ContentPageShell
      title="Affiliate Disclosure"
      intro="Plan Your Park participates in affiliate programs and may earn commissions from qualifying purchases made through certain links on this site."
    >
      <section>
        <h2>What this means</h2>
        <p>
          If you click some ticket, travel gear, or product links and then make a purchase, Plan Your Park may receive a commission. There is no additional cost to you.
        </p>
      </section>

      <section>
        <h2>Why it matters</h2>
        <p>
          Affiliate revenue helps support the ongoing work of maintaining park data, improving planning tools, and publishing trip-planning guides.
        </p>
      </section>

      <section>
        <h2>Editorial independence</h2>
        <p>
          The goal is to recommend useful options for families planning Orlando trips, not to overwhelm pages with irrelevant links. Monetization should support the product, not replace it.
        </p>
      </section>
    </ContentPageShell>
  );
}
