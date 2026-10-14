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
import { HeroForm } from "@/components/admin/forms/hero-form";
import { ClientMarqueeForm } from "@/components/admin/forms/client-marquee-form";
import { PrincipleForm } from "@/components/admin/forms/principle-form";
import { StatBandForm } from "@/components/admin/forms/stat-band-form";
import { FoundationForm } from "@/components/admin/forms/foundation-form";
import { IsoForm } from "@/components/admin/forms/iso-form";
import { StrengthForm } from "@/components/admin/forms/strength-form";
import { TimelineForm } from "@/components/admin/forms/timeline-form";
import { ProjectsForm } from "@/components/admin/forms/projects-form";
import { SupportForm } from "@/components/admin/forms/support-form";
import { PartnerCtaForm } from "@/components/admin/forms/partner-cta-form";
import type { HomeSections } from "@/data/content-types";

const EDITABLE = "home";

// Editor nav IDs. Most map 1:1 to a `HomeSections` key; `stats` and `foundation`
// are sub-editors that both write slices of the single `principle` object, so the
// nav can split that one section into three screens without splitting the data.
type SectionId =
  | keyof HomeSections
  | "stats"
  | "foundation";

// Section order + labels for the editor nav. Matches the order on the live page.
const SECTIONS: { key: SectionId; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "clientMarquee", label: "Client Logos" },
  { key: "principle", label: "Who We Are" },
  { key: "stats", label: "Stat Band" },
  { key: "foundation", label: "Vision / Mission / Values" },
  { key: "isoBand", label: "ISO Band" },
  { key: "strength", label: "Our Strength" },
  { key: "timeline", label: "Our Journey" },
  { key: "projects", label: "Project Portfolio" },
  { key: "support", label: "After-Sales" },
  { key: "partnerCta", label: "Ready to Partner" },
];

type Mode = "list" | "edit";

export function PagesWorkspace({ initialSlug }: { initialSlug?: string }) {
  const [pages, setPages] = useState<PageListEntry[]>([]);
  const [mode, setMode] = useState<Mode>(
    initialSlug === EDITABLE ? "edit" : "list",
  );
  const [active, setActive] = useState<SectionId>("hero");

  const [content, setContent] = useState<HomeSections>({});
  const [demo, setDemo] = useState<HomeSections | null>(null);
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
  // pages list; the editor fetches just the home sections. Neither pulls the
  // other's data, so /pages and /pages/home each make a single request.
  useEffect(() => {
    if (mode !== "edit" || contentLoaded) return;
    let cancelled = false;
    getPage<HomeSections>(EDITABLE)
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
  }, [mode, contentLoaded]);

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

  function updateSection<K extends keyof HomeSections>(
    key: K,
    next: HomeSections[K],
  ) {
    setContent((c) => ({ ...c, [key]: next }));
    setStatus(null);
  }

  function openEditor(slug: string) {
    if (slug !== EDITABLE) return;
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
      const res = await savePage<HomeSections>(EDITABLE, { sections: content });
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
        const res = await getDemo<HomeSections>(EDITABLE);
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
      const res = await applyDemo<HomeSections>(EDITABLE);
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
    switch (active) {
      case "hero":
        return <HeroForm value={content.hero} onChange={(n) => updateSection("hero", n)} slug={EDITABLE} />;
      case "clientMarquee":
        return <ClientMarqueeForm value={content.clientMarquee} onChange={(n) => updateSection("clientMarquee", n)} slug={EDITABLE} />;
      case "principle":
        return <PrincipleForm value={content.principle} onChange={(n) => updateSection("principle", n)} slug={EDITABLE} />;
      case "stats":
        return <StatBandForm value={content.principle} onChange={(n) => updateSection("principle", n)} slug={EDITABLE} />;
      case "foundation":
        return <FoundationForm value={content.principle} onChange={(n) => updateSection("principle", n)} slug={EDITABLE} />;
      case "isoBand":
        return <IsoForm value={content.isoBand} onChange={(n) => updateSection("isoBand", n)} slug={EDITABLE} />;
      case "strength":
        return <StrengthForm value={content.strength} onChange={(n) => updateSection("strength", n)} slug={EDITABLE} />;
      case "timeline":
        return <TimelineForm value={content.timeline} onChange={(n) => updateSection("timeline", n)} slug={EDITABLE} />;
      case "projects":
        return <ProjectsForm value={content.projects} onChange={(n) => updateSection("projects", n)} slug={EDITABLE} />;
      case "support":
        return <SupportForm value={content.support} onChange={(n) => updateSection("support", n)} slug={EDITABLE} />;
      case "partnerCta":
        return <PartnerCtaForm value={content.partnerCta} onChange={(n) => updateSection("partnerCta", n)} slug={EDITABLE} />;
      default:
        return null;
    }
  }

  if (mode === "list") {
    return (
      <div className="mx-auto max-w-3xl pt-4 sm:pt-6 lg:pt-8">
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
          <ul className="space-y-2.5">
            {pages.map((page) => (
              <PageRow key={page.slug} page={page} onOpen={openEditor} />
            ))}
          </ul>
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
              <span className="font-display font-bold text-offwhite">Home</span>
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
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(s.key)}
                className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors lg:w-full ${
                  active === s.key
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
        className={`group flex w-full items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5 text-left transition-all ${
          page.editable
            ? "hover:-translate-y-px hover:border-teal/40 hover:bg-card/80"
            : "cursor-not-allowed opacity-55"
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
