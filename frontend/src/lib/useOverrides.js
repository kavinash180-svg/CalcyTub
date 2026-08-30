import { useEffect, useState } from "react";
import { api } from "./api";

let cached = null;
let inFlight = null;

export function useOverrides() {
  const [overrides, setOverrides] = useState(cached || {});
  useEffect(() => {
    if (cached) return;
    if (!inFlight) {
      inFlight = api
        .get("/content/overrides")
        .then((r) => {
          cached = r.data || {};
          return cached;
        })
        .catch(() => (cached = {}));
    }
    inFlight.then((data) => setOverrides(data));
  }, []);
  return overrides;
}

export function mergeOverride(calc, overrides) {
  const o = overrides?.[calc.slug];
  if (!o) return calc;
  return { ...calc, ...o };
}
