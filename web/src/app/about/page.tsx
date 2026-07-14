import ContentPageShell from "@/components/ContentPageShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description: "Learn how Plan Your Park helps families choose the right Orlando theme park rides, parks, and dining experiences.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ContentPageShell
      title="About Plan Your Park"
      intro="Plan Your Park helps families plan better Orlando theme park trips — especially when height limits, kid comfort, accessibility, and park fit matter."
    >
      <section>
        <h2>What we do</h2>
        <p>
          We make it easier to compare parks, browse rides, and figure out what actually works for your family before you buy tickets or build your itinerary.
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
          Some pages include affiliate links for tickets, travel gear, and related trip-planning products. If you buy through those links, Plan Your Park may earn a commission at no extra cost to you.
        </p>
      </section>
    </ContentPageShell>
  );
}
