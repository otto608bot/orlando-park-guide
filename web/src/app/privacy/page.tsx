import ContentPageShell from "@/components/ContentPageShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Read the Plan Your Park privacy policy covering analytics, forms, and affiliate links.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <ContentPageShell
      title="Privacy Policy"
      intro="This page explains what information Plan Your Park may collect, how it is used, and the tools involved in running the site."
    >
      <section>
        <h2>Information you submit</h2>
        <p>
          If you submit a newsletter signup or question form, the information you provide may be used to respond to you, improve the site, or send the updates you requested.
        </p>
      </section>

      <section>
        <h2>Analytics</h2>
        <p>
          Plan Your Park uses analytics tools to understand how visitors use the site, which pages are useful, and where the experience can be improved.
        </p>
      </section>

      <section>
        <h2>Affiliate links</h2>
        <p>
          Some links on this site are affiliate links. Clicking those links may allow partners to attribute referrals to Plan Your Park for commission reporting.
        </p>
      </section>

      <section>
        <h2>Third-party services</h2>
        <p>
          The site may rely on third-party services for analytics, form handling, content management, and affiliate tracking. Those services have their own privacy policies and data-handling practices.
        </p>
      </section>
    </ContentPageShell>
  );
}
