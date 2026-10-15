"use client";

import { useState } from "react";
import {
  AddButton,
  Field,
  MediaField,
  RemoveButton,
  SectionCard,
  Select,
  TextArea,
  TextInput,
  inputCls,
} from "@/components/admin/form-primitives";
import type { PortfolioContent } from "@/data/content-types";
import type { Project } from "@/data/company";
import type { ServiceCategorySlug } from "@/data/services";

export const EMPTY_PORTFOLIO: PortfolioContent = { projects: [] };

const CATEGORIES = [
  { value: "substation", label: "Substation (blue)" },
  { value: "solar", label: "Solar (amber)" },
  { value: "mep", label: "MEP / EPC (teal)" },
  { value: "water-treatment", label: "Water Treatment (purple)" },
  { value: "after-sales", label: "After-Sales (cyan)" },
];

const STATUSES = [
  { value: "Ongoing", label: "Ongoing" },
  { value: "Completed", label: "Completed" },
];

const uid = () => `proj-${Math.random().toString(36).slice(2, 9)}`;
const emptyProject = (): Project => ({
  id: uid(),
  categorySlug: "mep",
  statusLabel: "",
  title: "",
  client: "",
  metric: "",
  status: "Ongoing",
  image: "",
});
const previewSrc = (v: string) => (!v ? "" : /^https?:\/\//i.test(v) || v.startsWith("/") ? v : `/${v}`);

export function PortfolioForm({
  value,
  onChange,
  slug,
}: {
  value: PortfolioContent | undefined;
  onChange: (next: PortfolioContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PORTFOLIO;
  const list = v.projects;
  const [open, setOpen] = useState<number | null>(null);

  const setList = (projects: Project[]) => onChange({ ...v, projects });
  const upd = (i: number, patch: Partial<Project>) => setList(list.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  if (open !== null) {
    const p = list[open];
    if (!p) {
      setOpen(null);
      return null;
    }
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setOpen(null)} aria-label="Back" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-teal/40 hover:bg-white/5 hover:text-offwhite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <nav className="flex items-center gap-2 text-sm leading-none">
            <button type="button" onClick={() => setOpen(null)} className="font-medium text-muted transition-colors hover:text-teal-light">Projects</button>
            <span className="text-muted/40">/</span>
            <span className="max-w-[18rem] truncate font-display font-bold text-offwhite">{p.title || "Untitled"}</span>
          </nav>
        </div>
        <SectionCard title="Project">
          <div className="space-y-3">
            <Field label="Title"><TextInput value={p.title} onChange={(x) => upd(open, { title: x })} /></Field>
            <Field label="Client"><TextInput value={p.client} onChange={(x) => upd(open, { client: x })} /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Division (sets the card colour)"><Select value={p.categorySlug} onChange={(x) => upd(open, { categorySlug: x as ServiceCategorySlug })} options={CATEGORIES} /></Field>
              <Field label="Status"><Select value={p.status} onChange={(x) => upd(open, { status: x as Project["status"] })} options={STATUSES} /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Status label" hint="e.g. 'MEP · Ongoing' — the chip over the photo."><TextInput value={p.statusLabel} onChange={(x) => upd(open, { statusLabel: x })} placeholder="MEP · Ongoing" /></Field>
              <Field label="Metric"><TextInput value={p.metric} onChange={(x) => upd(open, { metric: x })} placeholder="BDT 91 Cr" /></Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
              <Field label="PO value (Cr)" hint="Sorts the grid. Optional."><input type="number" className={inputCls} value={p.valueCr ?? ""} onChange={(e) => upd(open, { valueCr: e.target.value === "" ? undefined : Number(e.target.value) })} /></Field>
              <label className="flex items-end gap-2 pb-2.5 text-xs font-medium text-muted">
                <input type="checkbox" checked={!!p.featured} onChange={(e) => upd(open, { featured: e.target.checked })} />
                Featured (wide card, shows description)
              </label>
            </div>
            <Field label="Description" hint="Shown on featured cards and in the detail modal."><TextArea value={p.description ?? ""} onChange={(x) => upd(open, { description: x })} rows={3} /></Field>
            <MediaField label="Image" kind="image" slug={slug} value={p.image ?? ""} onChange={(x) => upd(open, { image: x })} />
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Portfolio projects"
        description="Open a project to edit it. The division sets each card's accent colour."
        action={<AddButton label="Add project" onClick={() => { setList([...list, emptyProject()]); setOpen(list.length); }} />}
      >
        {list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-navy/30 px-4 py-6 text-center text-xs text-muted">
            No projects yet — add one, or load the demo.
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((p, i) => {
              const t = previewSrc(p.image ?? "");
              return (
                <div key={p.id} className="group flex items-center gap-3 rounded-lg border border-border bg-navy/40 p-2.5 transition-colors hover:border-teal/40">
                  <button type="button" onClick={() => setOpen(i)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    {t ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t} alt="" className="h-10 w-14 shrink-0 rounded-md border border-border/60 object-cover" />
                    ) : (
                      <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-navy/40 text-[9px] text-muted">img</span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-offwhite">{p.title || "Untitled project"}</span>
                      <span className="mt-0.5 block truncate text-xs text-muted">{p.client} · {p.statusLabel || p.categorySlug}</span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M9 6l6 6-6 6" /></svg>
                    </span>
                  </button>
                  <RemoveButton onClick={() => setList(list.filter((_, idx) => idx !== i))} />
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
