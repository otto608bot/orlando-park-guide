import ContentPageShell from "@/components/ContentPageShell";
import Link from "next/link";
import { createPageMetadata, getAffiliateDisclosureJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Affiliate Disclosure — Tickets & Gear Links",
  description:
    "Plan Your Park may earn a commission from theme park ticket and packing-gear links (including Undercover Tourist and Amazon Associates) at no extra cost to you.",
  path: "/affiliate-disclosure",
  keywords: [
    "Plan Your Park affiliate disclosure",
    "FTC affiliate disclosure",
    "theme park ticket affiliate",
  ],
});

const disclosureJsonLd = getAffiliateDisclosureJsonLd();

export default function AffiliateDisclosurePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(disclosureJsonLd) }}
      />
      <ContentPageShell
        title="Affiliate Disclosure"
        intro="Plan Your Park participates in affiliate programs and may earn commissions from qualifying purchases made through certain links on this site."
      >
        <section>
          <h2>What this means</h2>
          <p>
            If you click some ticket, travel gear, or product links and then make a purchase, Plan
            Your Park may receive a commission. There is no additional cost to you. Pages with
            commercial links also point here so the relationship stays clear (FTC-style disclosure).
          </p>
        </section>

        <section>
          <h2>Programs we currently use</h2>
          <ul>
            <li>
              <strong>Theme park tickets</strong> — partner ticket links (including Undercover
              Tourist via CJ) on parks, deals, and commercial guides
            </li>
            <li>
              <strong>Packing and gear</strong> — Amazon Associates (
              <code>tag=planyourpark-20</code>) on packing and gear mentions when those products are
              relevant
            </li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            See current ticket options on <Link href="/deals/">family ticket deals</Link> and gear
            ideas on the{" "}
            <Link href="/blog/disney-world-packing-list-kids/">kids packing list</Link>.
          </p>
        </section>

        <section>
          <h2>Why it matters</h2>
          <p>
            Affiliate revenue helps support the ongoing work of maintaining park data, improving
            planning tools (like the height ride finder), and publishing trip-planning guides for
            families.
          </p>
        </section>

        <section>
          <h2>Editorial independence</h2>
          <p>
            The goal is to recommend useful options for families planning Orlando trips, not to
            overwhelm pages with irrelevant links. Height filters and park-fit advice come first;
            monetization should support the product, not replace it. Do affiliate links change ride
            height advice? No — cast members still enforce posted park requirements on trip day.
          </p>
        </section>

        <section>
          <h2>Questions</h2>
          <p>
            Questions about a specific link or partnership? <Link href="/contact/">Contact us</Link>{" "}
            or read more <Link href="/about/">about Plan Your Park</Link>.
          </p>
        </section>
      </ContentPageShell>
    </>
  );
}
