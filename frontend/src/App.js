import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import CalculatorsIndexPage from "@/pages/CalculatorsIndexPage";
import { CategoriesIndexPage } from "@/pages/CategoryPage";
import AboutPage, { ContactPage } from "@/pages/AboutPage";
import LegalPage from "@/pages/LegalPage";
import { ArticlesIndexPage, ArticlePage } from "@/pages/ArticlesPage";
import AdminPage from "@/pages/AdminPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SlugResolver from "@/components/SlugResolver";
import LegacyRedirect from "@/components/LegacyRedirect";
import ComparePage from "@/pages/ComparePage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculators" element={<CalculatorsIndexPage />} />
          <Route path="/categories" element={<CategoriesIndexPage />} />
          <Route path="/articles" element={<ArticlesIndexPage />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/compare" element={<ComparePage />} />

          {/* Legacy URLs — 301-equivalent client redirects */}
          <Route path="/calculator/:slug" element={<LegacyRedirect />} />
          <Route path="/category/:slug" element={<LegacyRedirect />} />

          {/* Clean SEO URL: /home-loan-emi-calculator, /finance, ... */}
          <Route path="/:slug" element={<SlugResolver />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
