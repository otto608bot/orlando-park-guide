import ContentPageShell from "@/components/ContentPageShell";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Plan Your Park Analytics Access Privacy Policy",
  description:
    "Privacy details for the private, read-only Plan Your Park Google Analytics and Search Console connection.",
  path: "/analytics-access/privacy",
});

export default function AnalyticsAccessPrivacyPage() {
  return (
    <ContentPageShell
      title="Analytics Access Privacy Policy"
      intro="This policy covers the private Google connection used by the Plan Your Park owner. The website's visitor privacy policy is separate."
    >
      <section>
        <h2>Google data accessed</h2>
        <p>
          With the account holder&apos;s consent, the connection requests read-only access to Google
          Analytics and Google Search Console. It reads reporting data for the Plan Your Park
          properties, such as sessions, pages, traffic sources, search queries, impressions, clicks,
          and search positions. It does not request Gmail, Drive, or permission to change Analytics
          or Search Console settings.
        </p>
      </section>
      <section>
        <h2>Purpose and processing</h2>
        <p>
          The site owner uses these reports to measure website performance and prioritize site
          improvements. Selected report figures may be processed by the owner&apos;s AI assistant and
          its model provider to prepare internal summaries. The connection is not used to sell Google
          account data, serve ads, or provide access to website visitors.
        </p>
      </section>
      <section>
        <h2>Storage and sharing</h2>
        <p>
          OAuth credentials are stored in an operator-controlled, non-public local file rather than
          in the website or public repository. Dated reporting summaries may be retained in the
          owner&apos;s internal project files. Google report data is not intentionally published on the
          public site. Access is limited to the owner&apos;s authorized tools and the service providers
          involved in processing internal reviews.
        </p>
      </section>
      <section>
        <h2>Revocation and deletion</h2>
        <p>
          The account holder can revoke this connection in their Google Account&apos;s third-party
          connections settings at any time. The owner can also delete the locally stored OAuth
          credentials and internal report files. For a data or privacy question, use the{" "}
          <Link href="/contact/">contact page</Link>.
        </p>
      </section>
      <section>
        <h2>Scope of this policy</h2>
        <p>
          This page applies only to the owner&apos;s Analytics Access connection. For information
          collected from visitors to Plan Your Park, see the website&apos;s general{" "}
          <Link href="/privacy/">privacy policy</Link>.
        </p>
      </section>
    </ContentPageShell>
  );
}
