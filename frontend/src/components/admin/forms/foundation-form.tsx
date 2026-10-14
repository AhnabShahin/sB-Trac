"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  RepeaterItem,
  SectionCard,
  Select,
  TextArea,
  TextInput,
  inputCls,
} from "@/components/admin/form-primitives";
import type { PrincipleContent } from "@/data/content-types";
import { EMPTY_PRINCIPLE } from "@/components/admin/forms/principle-form";

const ACCENTS = [
  { value: "teal", label: "Teal" },
  { value: "blue", label: "Blue" },
  { value: "amber", label: "Amber" },
];

export function FoundationForm({
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
      <SectionCard
        title="Vision, Mission & Values"
        description="The foundation cards below the stat band."
        action={<AddButton label="Add card" onClick={() => set({ pillars: [...v.pillars, { title: "", accent: "teal", description: "", items: [] }] })} />}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Eyebrow"><TextInput value={v.foundationEyebrow} onChange={(x) => set({ foundationEyebrow: x })} placeholder="Our Foundation" /></Field>
          <Field label="Heading"><TextInput value={v.foundationHeading} onChange={(x) => set({ foundationHeading: x })} placeholder="Vision, Mission & Values" /></Field>
        </div>
        <div className="mt-3 space-y-3">
          {v.pillars.length === 0 ? (
            <EmptyRow text="No cards yet." />
          ) : (
            v.pillars.map((pillar, i) => {
              const upd = (patch: Partial<typeof pillar>) => set({ pillars: v.pillars.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ pillars: v.pillars.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                    <Field label="Title"><TextInput value={pillar.title} onChange={(x) => upd({ title: x })} /></Field>
                    <Field label="Accent"><Select value={pillar.accent} onChange={(x) => upd({ accent: x as typeof pillar.accent })} options={ACCENTS} /></Field>
                  </div>
                  <Field label="Description"><TextArea value={pillar.description} onChange={(x) => upd({ description: x })} rows={2} /></Field>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted">List items (optional)</span>
                      <AddButton label="Add item" onClick={() => upd({ items: [...pillar.items, { label: "" }] })} />
                    </div>
                    {pillar.items.length === 0 ? null : (
                      <div className="space-y-2">
                        {pillar.items.map((item, j) => (
                          <div key={j} className="flex gap-2">
                            <input className={inputCls} value={item.label} placeholder="People First" onChange={(e) => upd({ items: pillar.items.map((it, idx) => (idx === j ? { label: e.target.value } : it)) })} />
                            <button type="button" aria-label="Remove" onClick={() => upd({ items: pillar.items.filter((_, idx) => idx !== j) })} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-sm text-muted transition-colors hover:border-red-500/40 hover:text-red-300">✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </RepeaterItem>
              );
            })
          )}
        </div>
      </SectionCard>
    </div>
  );
}
