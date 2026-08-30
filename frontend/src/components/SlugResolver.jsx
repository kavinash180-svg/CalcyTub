import { useParams } from "react-router-dom";
import CalculatorPage from "../pages/CalculatorPage";
import CategoryPage from "../pages/CategoryPage";
import NotFoundPage from "../pages/NotFoundPage";
import { getCalculator } from "../lib/calculators";
import { getCategory } from "../lib/categories";

/**
 * Resolves a bare /:slug URL to a calculator, category, or 404.
 * Categories take priority (they're a smaller, curated set).
 */
export default function SlugResolver() {
  const { slug } = useParams();
  if (getCategory(slug)) return <CategoryPage />;
  if (getCalculator(slug)) return <CalculatorPage />;
  return <NotFoundPage />;
}
