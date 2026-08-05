import ContentPageShell from "@/components/ContentPageShell";
import QuestionForm from "@/components/QuestionForm";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact Plan Your Park — Family Trip Questions",
  description:
    "Ask an Orlando park planning question, report a height or guide correction, or reach out about family-travel partnerships.",
  path: "/contact",
  keywords: [
    "contact Plan Your Park",
    "Orlando park planning question",
    "theme park height correction",
  ],
});

export default function ContactPage() {
  return (
    <ContentPageShell
      title="Contact Plan Your Park"
      intro="Have a question, found something outdated, or want to suggest a guide we should build? Send it here."
    >
      <section>
        <h2>Ask a planning question</h2>
        <p>
          Use the form below for Orlando park planning questions, factual corrections, or feedback
          about a guide, ride page, or dining page. For self-serve planning first, try the{" "}
          <Link href="/rides/?height=40">ride finder by height</Link>,{" "}
          <Link href="/parks/">parks hub</Link>, or{" "}
          <Link href="/blog/">family guides</Link>.
        </p>
        <QuestionForm title="Ask Plan Your Park" />
      </section>

      <section>
        <h2>Partnerships and affiliate questions</h2>
        <p>
          If you are a travel brand, ticket seller, or family travel partner and want to discuss
          collaboration, use the same form and include relevant details. Commercial link policy is
          on our <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.
        </p>
      </section>
    </ContentPageShell>
  );
}
