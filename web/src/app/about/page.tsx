import ContentPageShell from "@/components/ContentPageShell";
import Link from "next/link";
import { createPageMetadata, getAboutJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About Plan Your Park — Family Orlando Park Planning",
  description:
    "We help families with kids choose the right Orlando parks and rides — height filters, park fit, and trusted ticket links without generic park hype.",
  path: "/about",
  keywords: [
    "Plan Your Park",
    "Orlando parks with kids",
    "family theme park planning",
    "rides by height Orlando",
  ],
});

const aboutJsonLd = getAboutJsonLd();

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <ContentPageShell
        title="About Plan Your Park"
        intro="Plan Your Park helps families plan better Orlando theme park trips — especially when height limits, kid comfort, accessibility, and park fit matter."
      >
        <section>
          <h2>What we do</h2>
          <p>
            We make it easier to compare parks, browse rides, and figure out what actually works for
            your family before you buy tickets or build your itinerary. Start with height and energy,
            not marketing slogans.
          </p>
        </section>

        <section>
          <h2>Who it is for</h2>
          <ul>
            <li>Families planning Disney World or Universal Orlando trips</li>
            <li>Parents with kids who may not meet every ride height requirement</li>
            <li>Travelers comparing thrill level, accessibility, and dining options</li>
            <li>People who want practical planning help instead of generic park hype</li>
          </ul>
        </section>

        <section>
          <h2>How we make money</h2>
          <p>
            Some pages include affiliate links for tickets, travel gear, and related trip-planning
            products. If you buy through those links, Plan Your Park may earn a commission at no
            extra cost to you. Full details live on our{" "}
            <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.
          </p>
        </section>

        <section>
          <h2>Start planning</h2>
          <p>
            Start with the <Link href="/parks/">Orlando parks comparison</Link>, use the{" "}
            <Link href="/rides/?height=40">ride finder for your child&apos;s height</Link>, skim{" "}
            <Link href="/blog/best-magic-kingdom-rides-kids-under-40-inches/">
              Magic Kingdom rides under 40 inches
            </Link>{" "}
            or the{" "}
            <Link href="/blog/epic-universe-1-day-plan/">Epic Universe 1-day plan</Link>, then
            compare <Link href="/deals/">family ticket options</Link> once you know where you want to
            go.
          </p>
          <p className="about-chip-row" style={{ marginTop: "1rem" }}>
            <Link href="/rides/?height=40">Height filter ~40&quot;</Link>
            {" · "}
            <Link href="/parks/magic-kingdom/">Magic Kingdom</Link>
            {" · "}
            <Link href="/parks/epic-universe/">Epic Universe</Link>
            {" · "}
            <Link href="/blog/">Family guides</Link>
            {" · "}
            <Link href="/contact/">Contact</Link>
          </p>
        </section>

        <section>
          <h2>Quick answers</h2>
          <h3 style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>What is Plan Your Park?</h3>
          <p>
            A free family planning site for Orlando theme parks: filter rides by kid height and
            thrill, compare Disney, Universal, Epic Universe, SeaWorld, and LEGOLAND, then open
            trusted ticket or packing links when you are ready.
          </p>
          <h3 style={{ fontSize: "1.05rem", margin: "1rem 0 0.35rem" }}>
            How does Plan Your Park make money?
          </h3>
          <p>
            Some ticket and product links are affiliate links (including ticket partners and Amazon).
            If you buy through them, we may earn a commission at no extra cost to you. See the{" "}
            <Link href="/affiliate-disclosure/">affiliate disclosure</Link> for details.
          </p>
        </section>
      </ContentPageShell>
    </>
  );
}
