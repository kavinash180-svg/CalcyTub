import { useEffect, useState } from "react";
import { api, setToken, getToken } from "../lib/api";
import { ALL_CALCULATORS } from "../lib/calculators";
import { useSEO } from "../lib/useSEO";
import { toast, Toaster } from "sonner";

function LoginForm({ onSuccess }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post("/admin/login", { username: u, password: p });
      setToken(r.data.access_token);
      onSuccess();
    } catch (e2) {
      setErr(e2.response?.data?.detail || "Login failed");
    }
  };
  return (
    <form onSubmit={submit} className="calc-card max-w-md mx-auto p-6 space-y-3" data-testid="admin-login-form">
      <h1 className="font-display text-2xl font-semibold">Admin Login</h1>
      <input
        placeholder="Username"
        value={u}
        onChange={(e) => setU(e.target.value)}
        data-testid="admin-username"
        className="w-full h-11 px-3 rounded-md border border-input bg-card"
      />
      <input
        placeholder="Password"
        type="password"
        value={p}
        onChange={(e) => setP(e.target.value)}
        data-testid="admin-password"
        className="w-full h-11 px-3 rounded-md border border-input bg-card"
      />
      {err && <div className="text-sm text-destructive" data-testid="admin-login-error">{err}</div>}
      <button type="submit" data-testid="admin-login-btn" className="h-11 w-full rounded-md bg-primary text-primary-foreground font-medium">
        Sign in
      </button>
    </form>
  );
}

function CalcOverrides() {
  const [overrides, setOverrides] = useState({});
  const [selected, setSelected] = useState(ALL_CALCULATORS[0].slug);
  const [fields, setFields] = useState({});
  useEffect(() => {
    api.get("/admin/overrides").then((r) => setOverrides(r.data || {}));
  }, []);
  useEffect(() => {
    setFields(overrides[selected] || {});
  }, [selected, overrides]);

  const base = ALL_CALCULATORS.find((c) => c.slug === selected);
  const save = async () => {
    await api.put("/admin/overrides", { slug: selected, fields });
    setOverrides({ ...overrides, [selected]: fields });
    toast.success("Saved");
  };
  const clear = async () => {
    await api.delete(`/admin/overrides/${selected}`);
    const { [selected]: _, ...rest } = overrides;
    setOverrides(rest);
    setFields({});
    toast.success("Reset to default");
  };

  return (
    <div className="calc-card p-5">
      <h2 className="font-display text-xl font-semibold mb-3">Edit Calculator Content</h2>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full h-11 px-3 rounded-md border border-input bg-card mb-4"
        data-testid="override-select"
      >
        {ALL_CALCULATORS.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name}</option>
        ))}
      </select>
      {["name", "shortDescription", "seoTitle", "metaDescription", "howItWorks", "workedExample"].map((k) => (
        <div key={k} className="mb-3">
          <label className="text-sm font-medium block mb-1">{k}</label>
          <textarea
            rows={k === "howItWorks" || k === "workedExample" ? 3 : 2}
            value={fields[k] ?? base?.[k] ?? ""}
            onChange={(e) => setFields({ ...fields, [k]: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-input bg-card text-sm"
            data-testid={`override-${k}`}
          />
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={save} className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm" data-testid="override-save">Save</button>
        <button onClick={clear} className="h-10 px-4 rounded-md border border-border text-sm" data-testid="override-reset">Reset to default</button>
      </div>
    </div>
  );
}

function Articles() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ slug: "", title: "", content: "", seoTitle: "", metaDescription: "", category: "", published: true });
  const load = () => api.get("/admin/articles").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);
  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/articles", form);
      setForm({ slug: "", title: "", content: "", seoTitle: "", metaDescription: "", category: "", published: true });
      load();
      toast.success("Article created");
    } catch (e2) {
      toast.error(e2.response?.data?.detail || "Failed");
    }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    await api.delete(`/admin/articles/${id}`);
    load();
  };
  const togglePublish = async (a) => {
    await api.put(`/admin/articles/${a.id}`, { published: !a.published });
    load();
  };
  return (
    <div className="calc-card p-5">
      <h2 className="font-display text-xl font-semibold mb-3">Articles</h2>
      <form onSubmit={create} className="grid sm:grid-cols-2 gap-3 mb-4">
        <input placeholder="Slug (url-safe)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="h-10 px-3 rounded-md border border-input" data-testid="article-slug" required />
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10 px-3 rounded-md border border-input" data-testid="article-title" required />
        <input placeholder="SEO Title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="h-10 px-3 rounded-md border border-input" />
        <input placeholder="Meta description" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="h-10 px-3 rounded-md border border-input" />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 px-3 rounded-md border border-input" />
        <textarea placeholder="Content" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="sm:col-span-2 px-3 py-2 rounded-md border border-input" data-testid="article-content" required />
        <button className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm sm:col-span-2" data-testid="article-create-btn">Create article</button>
      </form>
      <ul className="divide-y divide-border">
        {items.map((a) => (
          <li key={a.id} className="py-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-muted-foreground">/{a.slug} · {a.published ? "Published" : "Draft"}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => togglePublish(a)} className="text-xs px-3 py-1.5 rounded border border-border">
                {a.published ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => remove(a.id)} className="text-xs px-3 py-1.5 rounded border border-destructive/40 text-destructive">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Settings() {
  const [s, setS] = useState({ siteName: "", tagline: "", contactEmail: "", adsenseClient: "" });
  useEffect(() => { api.get("/content/settings").then((r) => setS(r.data)); }, []);
  const save = async () => {
    await api.put("/admin/settings", s);
    toast.success("Settings updated");
  };
  return (
    <div className="calc-card p-5">
      <h2 className="font-display text-xl font-semibold mb-3">Site Settings</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        {[["siteName", "Site Name"], ["tagline", "Tagline"], ["contactEmail", "Contact email"], ["adsenseClient", "AdSense Client ID (ca-pub-…)"]].map(([k, label]) => (
          <div key={k}>
            <label className="text-sm font-medium block mb-1">{label}</label>
            <input value={s[k] || ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input" />
          </div>
        ))}
      </div>
      <button onClick={save} className="mt-4 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm">Save settings</button>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(!!getToken());
  const [tab, setTab] = useState("calc");
  useSEO({ title: "Admin — CalcyTub", description: "Admin panel", canonicalPath: "/admin" });
  useEffect(() => {
    if (!getToken()) return;
    api.get("/admin/me").catch(() => { setToken(null); setAuthed(false); });
  }, []);
  if (!authed) {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
        <Toaster richColors />
        <LoginForm onSuccess={() => setAuthed(true)} />
      </section>
    );
  }
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Toaster richColors />
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-semibold">Admin</h1>
        <button
          onClick={() => { setToken(null); setAuthed(false); }}
          className="text-sm px-3 py-1.5 rounded border border-border"
          data-testid="admin-logout"
        >
          Sign out
        </button>
      </div>
      <div className="flex gap-2 mb-5">
        {[["calc", "Calculators"], ["articles", "Articles"], ["settings", "Settings"]].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            data-testid={`admin-tab-${k}`}
            className={`px-3 py-1.5 rounded-md text-sm ${tab === k ? "bg-primary text-primary-foreground" : "border border-border"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "calc" && <CalcOverrides />}
      {tab === "articles" && <Articles />}
      {tab === "settings" && <Settings />}
    </section>
  );
}
