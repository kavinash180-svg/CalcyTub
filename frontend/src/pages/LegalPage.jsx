import { Link, useParams } from "react-router-dom";
import { useSEO } from "../lib/useSEO";

const PAGES = {
  privacy: {
    title: "Privacy Policy",
    body: `CalcyTub does not collect calculator inputs. All calculations run in your browser and are not sent to any server or third party.\n\nIf you contact us via email or a contact form, we may store your name, email and message solely to reply to your enquiry.\n\nWe may serve third-party advertisements (such as Google AdSense) which set their own cookies for personalization and measurement. You can control these via your browser or Google's Ads Settings.\n\nWe do not knowingly collect personal information from children under 13.`,
  },
  terms: {
    title: "Terms of Use",
    body: `By using CalcyTub you agree that the calculators are provided "as is" for informational and educational purposes only. We make no warranty of accuracy, fitness for a particular purpose or non-infringement.\n\nDo not rely on CalcyTub calculators for final financial, medical, engineering, legal or professional decisions. Verify results with qualified professionals or authoritative sources.`,
  },
  disclaimer: {
    title: "Disclaimer",
    body: `Finance calculators provide estimates only and are not financial advice, loan offers or guarantees. Actual lender offers depend on your circumstances, credit profile and prevailing rates.\n\nHealth and fitness calculators provide general estimates only and are not medical advice or diagnosis. Consult a licensed healthcare provider for medical decisions.\n\nAll calculators are provided for educational reference. CalcyTub is not liable for any loss arising from use of the results.`,
  },
  advertising: {
    title: "Advertising Disclosure",
    body: `CalcyTub may display advertisements provided by third-party ad networks such as Google AdSense. Ads are labelled as "Sponsored" or "Ad Space" and are separate from editorial content.\n\nWe do not accept payment to alter the outputs of calculators or the ranking of educational content. We may earn revenue when you interact with ads.`,
  },
  editorial: {
    title: "Editorial Policy",
    body: `Calculator formulas and content are written to be accurate, transparent and easy to understand. Each calculator page explains the formula used, its assumptions and a worked example.\n\nWe welcome corrections. If you find an error in any calculation or explanation, please contact us via the Contact page.`,
  },
};

export default function LegalPage() {
  const { slug } = useParams();
  const page = PAGES[slug];
  useSEO({
    title: page ? `${page.title} — CalcyTub` : "Legal — CalcyTub",
    description: page ? page.body.slice(0, 150) : "Legal information for CalcyTub.",
    canonicalPath: `/legal/${slug}`,
  });
  if (!page) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Page not found</h1>
        <Link to="/" className="text-primary hover:underline mt-3 inline-block">Home</Link>
      </section>
    );
  }
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4">{page.title}</h1>
      <div className="prose prose-slate max-w-none">
        {page.body.split("\n\n").map((p, i) => (
          <p key={i} className="text-sm text-foreground/90 leading-relaxed mb-3 whitespace-pre-line">{p}</p>
        ))}
      </div>
    </article>
  );
}
