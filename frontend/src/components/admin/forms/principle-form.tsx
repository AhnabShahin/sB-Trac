"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  SectionCard,
  TextArea,
  TextInput,
  inputCls,
} from "@/components/admin/form-primitives";
import type { PrincipleContent } from "@/data/content-types";

// The three editors below (Who We Are, Stat band, Vision/Mission/Values) all edit
// slices of this one `principle` object, so the whole shape is shared here.
export const EMPTY_PRINCIPLE: PrincipleContent = {
  eyebrow: "",
  heading: "",
  paragraphs: [],
  ctaLabel: "",
  ctaHref: "",
  glanceTitle: "",
  facts: [],
  stats: [],
  foundationEyebrow: "",
  foundationHeading: "",
  pillars: [],
};

export function PrincipleForm({
  value,
  onChange,
}: {
  value: PrincipleContent | undefined;
  onChange: (next: PrincipleContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PRINCIPLE;
  const set = (patch: Partial<PrincipleContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Who We Are" description="Intro column: eyebrow, heading, paragraphs and the button.">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Who We Are" /></Field>
          <Field label="Heading" hint="Use a line break (Enter) to split onto two lines.">
            <TextArea value={v.heading} onChange={(x) => set({ heading: x })} rows={2} />
          </Field>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-muted">Paragraphs</span>
              <AddButton label="Add paragraph" onClick={() => set({ paragraphs: [...v.paragraphs, ""] })} />
            </div>
            {v.paragraphs.length === 0 ? (
              <EmptyRow text="No paragraphs yet." />
            ) : (
              <div className="space-y-2">
                {v.paragraphs.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <TextArea value={p} onChange={(x) => set({ paragraphs: v.paragraphs.map((q, idx) => (idx === i ? x : q)) })} rows={3} />
                    <button type="button" aria-label="Remove" onClick={() => set({ paragraphs: v.paragraphs.filter((_, idx) => idx !== i) })} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-sm text-muted transition-colors hover:border-red-500/40 hover:text-red-300">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Button label"><TextInput value={v.ctaLabel} onChange={(x) => set({ ctaLabel: x })} /></Field>
            <Field label="Button link"><TextInput value={v.ctaHref} onChange={(x) => set({ ctaHref: x })} placeholder="/contact" /></Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="BTEL at a Glance"
        description="The facts panel on the right."
        action={<AddButton label="Add fact" onClick={() => set({ facts: [...v.facts, { label: "", value: "" }] })} />}
      >
        <Field label="Panel title"><TextInput value={v.glanceTitle} onChange={(x) => set({ glanceTitle: x })} placeholder="BTEL at a Glance" /></Field>
        <div className="mt-3 space-y-2.5">
          {v.facts.length === 0 ? (
            <EmptyRow text="No facts yet." />
          ) : (
            v.facts.map((fact, i) => {
              const upd = (patch: Partial<typeof fact>) => set({ facts: v.facts.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });
              return (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-2 rounded-lg border border-border/60 bg-navy/40 p-2">
                  <input className={inputCls} value={fact.label} placeholder="Founded" onChange={(e) => upd({ label: e.target.value })} />
                  <input className={inputCls} value={fact.value} placeholder="2009" onChange={(e) => upd({ value: e.target.value })} />
                  <label className="flex items-center gap-1.5 whitespace-nowrap px-1 text-[11px] text-muted">
                    <input type="checkbox" checked={!!fact.accent} onChange={(e) => upd({ accent: e.target.checked })} /> accent
                  </label>
                  <button type="button" aria-label="Remove" onClick={() => set({ facts: v.facts.filter((_, idx) => idx !== i) })} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm text-muted transition-colors hover:border-red-500/40 hover:text-red-300">✕</button>
                </div>
              );
            })
          )}
        </div>
      </SectionCard>
    </div>
  );
}
