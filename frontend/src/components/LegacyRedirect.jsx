import { Navigate, useParams } from "react-router-dom";

/**
 * Backwards-compatibility redirect: /calculator/:slug -> /:slug and
 * /category/:slug -> /:slug. Preserves search + hash.
 */
export default function LegacyRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/${slug}${window.location.search}${window.location.hash}`} replace />;
}
