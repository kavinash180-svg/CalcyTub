import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useSEO, breadcrumbSchema } from "../lib/useSEO";

export function ArticlesIndexPage() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    api.get("/content/articles").then((r) => {
      setItems(r.data || []);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);
  useSEO({ title: "Articles — CalcyTub", description: "Guides and explainers to help you understand calculators.", canonicalPath: "/articles" });
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold">Articles</h1>
      <p className="text-sm text-muted-foreground mt-2 mb-8">
        Guides and explainers to help you get more from CalcyTub.
      </p>
      {!loaded && <p className="text-sm text-muted-foreground">Loading…</p>}
      {loaded && items.length === 0 && (
        <div className="calc-card p-8 text-center">
          <p className="text-muted-foreground">No articles have been published yet. Check back soon.</p>
        </div>
      )}
      <div className="grid gap-4">
        {items.map((a) => (
          <Link key={a.id} to={`/articles/${a.slug}`} className="calc-card p-5" data-testid={`article-card-${a.slug}`}>
            <h3 className="font-display text-xl font-semibold">{a.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(a.createdAt).toLocaleDateString()}
              {a.category ? ` · ${a.category}` : ""}
            </p>
            <p className="text-sm mt-2 line-clamp-2">{(a.metaDescription || a.content).slice(0, 180)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ArticlePage() {
  const slug = window.location.pathname.split("/").pop();
  const [article, setArticle] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    api.get(`/content/articles/${slug}`)
      .then((r) => setArticle(r.data))
      .catch(() => setErr("Article not found"));
  }, [slug]);
  useSEO({
    title: article ? (article.seoTitle || `${article.title} — CalcyTub`) : "Article — CalcyTub",
    description: article?.metaDescription || "",
    canonicalPath: `/articles/${slug}`,
    jsonLd: article
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.metaDescription,
            datePublished: article.createdAt,
            dateModified: article.updatedAt || article.createdAt,
            author: { "@type": "Organization", name: "CalcyTub" },
            publisher: { "@type": "Organization", name: "CalcyTub" },
            mainEntityOfPage: { "@type": "WebPage", "@id": `${window.location.origin}/articles/${slug}` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
            { name: article.title, path: `/articles/${slug}` },
          ]),
        ]
      : null,
  });
  if (err) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">{err}</h1>
        <Link to="/articles" className="text-primary hover:underline mt-3 inline-block">Back to articles</Link>
      </section>
    );
  }
  if (!article) return <div className="max-w-3xl mx-auto p-10 text-sm text-muted-foreground">Loading…</div>;
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-xs text-muted-foreground">
        <Link to="/articles" className="hover:text-primary">Articles</Link> › {article.title}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">{article.title}</h1>
      <p className="text-xs text-muted-foreground mt-2">
        {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <div className="prose prose-slate max-w-none mt-6 whitespace-pre-line text-foreground/90 text-[15px] leading-relaxed">
        {article.content}
      </div>
    </article>
  );
}
