import ContentPageShell from "@/components/ContentPageShell";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Plan Your Park Analytics Access",
  description:
    "How the Plan Your Park owner uses a private, read-only Google Analytics and Search Console connection to review site performance.",
  path: "/analytics-access",
});

export default function AnalyticsAccessPage() {
  return (
    <ContentPageShell
      title="Plan Your Park Analytics Access"
      intro="A private, owner-operated connection for measuring and improving the Plan Your Park website. This is not a visitor account or a public app."
    >
      <section>
        <h2>What this connection does</h2>
        <p>
          With the site owner&apos;s authorization, it reads Google Analytics 4 and Google Search
          Console reports for Plan Your Park. The owner uses those reports to review traffic,
          search performance, and opportunities to improve the site. It does not request permission
          to edit either property.
        </p>
      </section>
      <section>
        <h2>Who can use it</h2>
        <p>
          This connection is intended only for the Plan Your Park operator, using a Google account
          already authorized for the site&apos;s Analytics and Search Console properties. Website
          visitors do not need to sign in or grant access.
        </p>
      </section>
      <section>
        <h2>Data and contact</h2>
        <p>
          Read the <Link href="/analytics-access/privacy/">Analytics Access privacy policy</Link>
          {" "}for the Google data requested, how it is handled, and how to revoke access. For
          questions, use the <Link href="/contact/">Plan Your Park contact page</Link>.
        </p>
      </section>
    </ContentPageShell>
  );
}
