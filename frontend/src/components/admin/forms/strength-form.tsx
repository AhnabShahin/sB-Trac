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
import type { StrengthContent } from "@/data/content-types";

export const EMPTY_STRENGTH: StrengthContent = {
  eyebrow: "",
  heading: "",
  intro: "",
  pillars: [],
};

const ICONS = [
  { value: "hardhat", label: "Hard hat" },
  { value: "coins", label: "Coins" },
  { value: "factory", label: "Factory" },
  { value: "truck", label: "Truck" },
  { value: "target", label: "Target" },
];

export function StrengthForm({
  value,
  onChange,
}: {
  value: StrengthContent | undefined;
  onChange: (next: StrengthContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_STRENGTH;
  const set = (patch: Partial<StrengthContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Operational Excellence" /></Field>
          <Field label="Heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} placeholder="Our Strength" /></Field>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={2} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Pillars"
        description="The capability cards."
        action={<AddButton label="Add pillar" onClick={() => set({ pillars: [...v.pillars, { title: "", description: "", icon: "hardhat" }] })} />}
      >
        {v.pillars.length === 0 ? (
          <EmptyRow text="No pillars yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.pillars.map((pillar, i) => {
              const upd = (patch: Partial<typeof pillar>) => set({ pillars: v.pillars.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ pillars: v.pillars.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                    <Field label="Title"><TextInput value={pillar.title} onChange={(x) => upd({ title: x })} /></Field>
                    <Field label="Icon"><Select value={pillar.icon} onChange={(x) => upd({ icon: x as typeof pillar.icon })} options={ICONS} /></Field>
                  </div>
                  <Field label="Description"><TextArea value={pillar.description} onChange={(x) => upd({ description: x })} rows={2} /></Field>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
