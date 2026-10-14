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
} from "@/components/admin/form-primitives";
import type { SupportContent } from "@/data/content-types";

export const EMPTY_SUPPORT: SupportContent = {
  eyebrow: "",
  heading: "",
  intro: "",
  features: [],
};

const ICONS = [
  { value: "wrench", label: "Wrench" },
  { value: "refresh", label: "Refresh" },
  { value: "target", label: "Target" },
  { value: "clock", label: "Clock" },
];

export function SupportForm({
  value,
  onChange,
}: {
  value: SupportContent | undefined;
  onChange: (next: SupportContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_SUPPORT;
  const set = (patch: Partial<SupportContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Post-Delivery" /></Field>
          <Field label="Heading" hint="Use a line break (Enter) to split onto two lines.">
            <TextArea value={v.heading} onChange={(x) => set({ heading: x })} rows={2} />
          </Field>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={3} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Features"
        description="The after-sales capability cards."
        action={<AddButton label="Add feature" onClick={() => set({ features: [...v.features, { title: "", description: "", icon: "wrench" }] })} />}
      >
        {v.features.length === 0 ? (
          <EmptyRow text="No features yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.features.map((feature, i) => {
              const upd = (patch: Partial<typeof feature>) => set({ features: v.features.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ features: v.features.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                    <Field label="Title"><TextInput value={feature.title} onChange={(x) => upd({ title: x })} /></Field>
                    <Field label="Icon"><Select value={feature.icon} onChange={(x) => upd({ icon: x as typeof feature.icon })} options={ICONS} /></Field>
                  </div>
                  <Field label="Description"><TextArea value={feature.description} onChange={(x) => upd({ description: x })} rows={2} /></Field>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
