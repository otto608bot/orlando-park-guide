import ContentPageShell from "@/components/ContentPageShell";
import QuestionForm from "@/components/QuestionForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description: "Contact Plan Your Park with Orlando trip-planning questions, corrections, or partnership inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ContentPageShell
      title="Contact"
      intro="Have a question, found something outdated, or want to suggest a guide we should build? Send it here."
    >
      <section>
        <h2>Ask a planning question</h2>
        <p>
          Use the form below for Orlando park planning questions, factual corrections, or feedback about a guide, ride page, or dining page.
        </p>
        <QuestionForm title="Ask Plan Your Park" />
      </section>

      <section>
        <h2>Partnerships and affiliate questions</h2>
        <p>
          If you are a travel brand, ticket seller, or family travel partner and want to discuss collaboration, use the same form and include relevant details.
        </p>
      </section>
    </ContentPageShell>
  );
}
