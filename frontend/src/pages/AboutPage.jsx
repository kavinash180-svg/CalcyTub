import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useSEO } from "../lib/useSEO";

export default function AboutPage() {
  useSEO({ title: "About CalcyTub", description: "Free online calculators, built to be fast, accurate and private.", canonicalPath: "/about" });
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold">About CalcyTub</h1>
      <p className="mt-4 text-foreground/90">
        CalcyTub is a free, ad-supported library of everyday calculators for finance,
        math, science, health and business. Our goal is to provide accurate results,
        clear formulas and a great mobile experience — without asking you to sign up.
      </p>
      <p className="mt-3 text-foreground/90">
        Every calculation runs entirely in your browser. We never store the numbers
        you type. If you spot an error or want to suggest a new calculator, please{" "}
        <a className="text-primary hover:underline" href="/contact">contact us</a>.
      </p>
    </article>
  );
}

export function ContactPage() {
  const [email, setEmail] = useState("hello@calcytub.com");
  useEffect(() => {
    api.get("/content/settings").then((r) => {
      if (r.data?.contactEmail) setEmail(r.data.contactEmail);
    }).catch(() => {});
  }, []);
  useSEO({ title: "Contact CalcyTub", description: "Get in touch with the CalcyTub team.", canonicalPath: "/contact" });
  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold">Contact</h1>
      <p className="mt-4 text-foreground/90">
        Have a suggestion, correction or partnership request? Send us an email — we
        read every message.
      </p>
      <div className="mt-6 calc-card p-5">
        <div className="text-sm text-muted-foreground">Email us at</div>
        <a href={`mailto:${email}`} className="mt-1 block text-2xl font-display font-semibold text-primary break-all">
          {email}
        </a>
        <p className="mt-4 text-xs text-muted-foreground">
          Please don't include sensitive personal, medical or financial information in your message.
        </p>
      </div>
    </article>
  );
}
