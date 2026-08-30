import { useEffect } from "react";

const SITE_NAME = "CalcyTub";

// Lightweight SEO hook — no external deps.
// Sets: document.title, meta (description, keywords, robots, og, twitter),
// canonical <link>, and up to N JSON-LD scripts.
export function useSEO({ title, description, canonicalPath, keywords, jsonLd, ogImage }) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (attr, key, val) => {
      if (!val) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta("name", "description", description);
    if (keywords && keywords.length) setMeta("name", "keywords", keywords.join(", "));
    setMeta("name", "robots", "index,follow,max-snippet:-1,max-image-preview:large");

    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:locale", "en_US");
    if (ogImage) setMeta("property", "og:image", ogImage);

    setMeta("name", "twitter:card", ogImage ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    if (ogImage) setMeta("name", "twitter:image", ogImage);

    // canonical + og:url
    const base = window.location.origin;
    const canonicalHref = canonicalPath ? `${base}${canonicalPath}` : window.location.href;
    let canon = document.head.querySelector('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.setAttribute("rel", "canonical");
      document.head.appendChild(canon);
    }
    canon.setAttribute("href", canonicalHref);
    setMeta("property", "og:url", canonicalHref);

    // Remove previously injected JSON-LD blocks and add new ones.
    Array.from(document.querySelectorAll("script[data-calcytub-jsonld]")).forEach((s) => s.remove());
    const items = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : jsonLd ? [jsonLd] : [];
    for (const item of items) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-calcytub-jsonld", "");
      script.text = JSON.stringify(item);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, keywords, jsonLd, ogImage]);
}

// Helper: BreadcrumbList JSON-LD from ordered items { name, path }
export function breadcrumbSchema(items) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${base}${it.path}`,
    })),
  };
}

// FAQPage JSON-LD from [{ q, a }]
export function faqSchema(items) {
  if (!items || !items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// WebSite JSON-LD (root)
export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: typeof window !== "undefined" ? window.location.origin : "",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${typeof window !== "undefined" ? window.location.origin : ""}/calculators?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});
