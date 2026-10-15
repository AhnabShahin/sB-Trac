"use client";

import { useEffect, useState } from "react";
import {
  applyDemo,
  getDemo,
  getPage,
  listPages,
  savePage,
  type PageListEntry,
} from "@/services/content";
import { PAGE_CONFIGS } from "@/components/admin/page-configs";

type Mode = "list" | "edit";
// A page's content is an open { sectionKey -> data } map — each page defines its
// own keys, so the workspace stays page-agnostic and the per-section forms own
// the real types.
type Sections = Record<string, unknown>;

export function PagesWorkspace({ initialSlug }: { initialSlug?: string }) {
  const [pages, setPages] = useState<PageListEntry[]>([]);
  const initialEditable = initialSlug && PAGE_CONFIGS[initialSlug] ? initialSlug : null;
  const [mode, setMode] = useState<Mode>(initialEditable ? "edit" : "list");
  const [activeSlug, setActiveSlug] = useState<string>(initialEditable ?? "home");
  const config = PAGE_CONFIGS[activeSlug];
  const [active, setActive] = useState<string>(config?.sections[0]?.id ?? "");

  const [content, setContent] = useState<Sections>({});
  const [demo, setDemo] = useState<Sections | null>(null);
  // Serialized last-saved content. Save is only enabled while the live form
  // differs from this, so an untouched page can't be re-saved for no reason.
  const [savedSnapshot, setSavedSnapshot] = useState<string>("{}");

  const [contentLoaded, setContentLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty = JSON.stringify(content) !== savedSnapshot;
  const editorLoading = mode === "edit" && !contentLoaded && !error;

  // Each view loads only its own data, once. The list view fetches just the
  // pages list; the editor fetches just the active page's sections. Neither pulls
  // the other's data, so /pages and /pages/<slug> each make a single request.
  useEffect(() => {
    if (mode !== "edit" || contentLoaded) return;
    let cancelled = false;
    getPage<Sections>(activeSlug)
      .then((page) => {
        if (cancelled) return;
        const sections = page.sections ?? {};
        setContent(sections);
        setSavedSnapshot(JSON.stringify(sections));
        setContentLoaded(true);
      })
      .catch((e) => !cancelled && setError(e?.message ?? "Failed to load."));
    return () => {
      cancelled = true;
    };
  }, [mode, contentLoaded, activeSlug]);

  useEffect(() => {
    if (mode !== "list" || pages.length) return;
    let cancelled = false;
    listPages()
      .then((list) => !cancelled && setPages(list.pages))
      .catch((e) => !cancelled && setError(e?.message ?? "Failed to load."));
    return () => {
      cancelled = true;
    };
  }, [mode, pages.length]);

  function updateSection(key: string, next: unknown) {
    setContent((c) => ({ ...c, [key]: next }));
    setStatus(null);
  }

  function openEditor(slug: string) {
    const target = PAGE_CONFIGS[slug];
    if (!target) return;
    setActiveSlug(slug);
    setActive(target.sections[0]?.id ?? "");
    setContent({});
    setDemo(null);
    setSavedSnapshot("{}");
    setContentLoaded(false);
    setMode("edit");
    setStatus(null);
    setError(null);
    window.history.replaceState(null, "", `/pages/${slug}`);
  }

  function backToList() {
    setMode("list");
    setStatus(null);
    window.history.replaceState(null, "", "/pages");
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      // The server materializes demo-sourced media into storage, so the saved
      // sections can differ from what we sent — adopt the response as the new
      // baseline so the form shows the storage URLs and stays "not dirty".
      const res = await savePage<Sections>(activeSlug, { sections: content });
      const saved = res.sections ?? content;
      setContent(saved);
      setSavedSnapshot(JSON.stringify(saved));
      setStatus("Saved — the live site now serves this content.");
    } catch (e) {
      setError((e as Error)?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  // Demo is fetched on demand (only when this button is used), so the editor's
  // own load never pays for it.
  async function handleLoadDemo() {
    setError(null);
    let d = demo;
    if (!d) {
      setSaving(true);
      try {
        const res = await getDemo<Sections>(activeSlug);
        d = res?.sections ?? null;
        setDemo(d);
      } catch (e) {
        setError((e as Error)?.message ?? "Failed to load demo.");
        return;
      } finally {
        setSaving(false);
      }
    }
    if (!d) return;
    setContent(d);
    setStatus("Demo loaded into the form. Review, then Save to apply.");
  }

  async function handleApplyDemo() {
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      const res = await applyDemo<Sections>(activeSlug);
      if (res.sections) {
        setContent(res.sections);
        setSavedSnapshot(JSON.stringify(res.sections));
      }
      setStatus("Demo applied — media copied to storage and saved to the site.");
    } catch (e) {
      setError((e as Error)?.message ?? "Apply failed.");
    } finally {
      setSaving(false);
    }
  }

  function renderActiveForm() {
    const section = config?.sections.find((s) => s.id === active);
    if (!section) return null;
    return section.render(
      content[section.dataKey],
      (next) => updateSection(section.dataKey, next),
      activeSlug,
    );
  }

  if (mode === "list") {
    const mainPages = pages.filter((p) => !p.group);
    const productPages = pages.filter((p) => p.group === "products");
    const globalPages = pages.filter((p) => p.group === "global");

    return (
      <div className="pt-4 sm:pt-6 lg:pt-8">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold text-offwhite">Pages</h1>
          <p className="mt-1 text-sm text-muted">
            Open an editable page to manage its content.
          </p>
        </header>
        {error ? <Banner tone="error">{error}</Banner> : null}
        {pages.length === 0 ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : (
          <div className="space-y-8">
            <PageList pages={mainPages} onOpen={openEditor} />

            {productPages.length > 0 ? (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  Products &amp; Services pages
                </h2>
                <PageList pages={productPages} onOpen={openEditor} />
              </section>
            ) : null}

            {globalPages.length > 0 ? (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  Site-wide
                </h2>
                <PageList pages={globalPages} onOpen={openEditor} />
              </section>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-border bg-navy/85 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={backToList}
              aria-label="Back to pages"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-teal/40 hover:bg-white/5 hover:text-offwhite"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm leading-none">
              <button
                type="button"
                onClick={backToList}
                className="font-medium text-muted transition-colors hover:text-teal-light"
              >
                Pages
              </button>
              <span className="text-muted/40">/</span>
              <span className="font-display font-bold text-offwhite">{config?.title ?? activeSlug}</span>
            </nav>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`mr-1 inline-flex items-center gap-1.5 text-xs font-medium transition-opacity ${
                dirty && !saving ? "text-amber opacity-100" : "opacity-0"
              }`}
              aria-hidden={!dirty}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
              Unsaved changes
            </span>
            <button type="button" onClick={handleLoadDemo} disabled={saving} className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-offwhite transition-colors hover:bg-white/5 disabled:opacity-40">
              Load demo
            </button>
            <button type="button" onClick={handleApplyDemo} disabled={saving} className="rounded-lg border border-amber/40 px-3 py-2 text-xs font-medium text-amber transition-colors hover:bg-amber/10 disabled:opacity-40">
              Apply demo to site
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !contentLoaded || !dirty}
              className="rounded-lg bg-teal px-5 py-2 text-xs font-semibold text-navy shadow-sm transition-colors hover:bg-teal-light disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {status ? <Banner tone="ok">{status}</Banner> : null}
      {error ? <Banner tone="error">{error}</Banner> : null}

      {editorLoading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[240px_minmax(0,1fr)]">
          {/* Section nav */}
          <nav className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-[92px] lg:mb-0 lg:max-h-[calc(100vh-180px)] lg:flex-col lg:self-start lg:overflow-y-auto lg:pb-0">
            {config?.sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors lg:w-full ${
                  active === s.id
                    ? "bg-teal/15 text-teal-light"
                    : "text-muted hover:bg-white/5 hover:text-offwhite"
                }`}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {/* Active section form */}
          <div className="min-w-0">{renderActiveForm()}</div>
        </div>
      )}
    </div>
  );
}

// A full-width list — each row spans the whole available width (no more
// max-w-3xl column stranding the list in a narrow strip with empty margins
// on either side), with the section count shown so a row carries more than
// just a title before the Edit action.
function PageList({
  pages,
  onOpen,
}: {
  pages: PageListEntry[];
  onOpen: (slug: string) => void;
}) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {pages.map((page) => (
        <PageRow key={page.slug} page={page} onOpen={onOpen} />
      ))}
    </ul>
  );
}

function PageRow({
  page,
  onOpen,
}: {
  page: PageListEntry;
  onOpen: (slug: string) => void;
}) {
  const initial = page.title.charAt(0).toUpperCase();
  return (
    <li>
      <button
        type="button"
        onClick={() => page.editable && onOpen(page.slug)}
        disabled={!page.editable}
        className={`group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors ${
          page.editable ? "hover:bg-white/[0.04]" : "cursor-not-allowed opacity-55"
        }`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold ${
            page.editable ? "bg-teal/15 text-teal-light" : "bg-border/50 text-muted"
          }`}
        >
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-offwhite">{page.title}</div>
          <div className="truncate text-xs text-muted">{page.url}</div>
        </div>
        <span className="hidden shrink-0 text-xs text-muted sm:block">
          {page.sections.length} section{page.sections.length === 1 ? "" : "s"}
        </span>
        {page.editable ? (
          <span className="shrink-0 text-xs font-semibold text-teal-light transition-transform group-hover:translate-x-0.5">
            Edit →
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-border/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
            soon
          </span>
        )}
      </button>
    </li>
  );
}

function Banner({
  tone,
  children,
}: {
  tone: "ok" | "error";
  children: React.ReactNode;
}) {
  const cls =
    tone === "ok"
      ? "border-teal/30 bg-teal/10 text-teal-light"
      : "border-red-500/30 bg-red-500/10 text-red-300";
  return (
    <p className={`mb-4 rounded-lg border px-4 py-2.5 text-sm ${cls}`}>{children}</p>
  );
}
