"use client";

import {
  AddButton,
  ColorField,
  EmptyRow,
  Field,
  RepeaterItem,
  SectionCard,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { ServicePillarItem, ServicePillarsSectionContent } from "@/data/content-types";

export const EMPTY_MEP_PILLARS: ServicePillarsSectionContent = { pillars: [] };

export function MepPillarsForm({
  value,
  onChange,
}: {
  value: ServicePillarsSectionContent | undefined;
  onChange: (next: ServicePillarsSectionContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_MEP_PILLARS;
  const set = (pillars: ServicePillarItem[]) => onChange({ pillars });

  return (
    <div className="space-y-5">
      <SectionCard
        title="M · E · P pillars"
        description="The three big-letter tiles below the hero."
        action={<AddButton label="Add pillar" onClick={() => set([...v.pillars, { letter: "", name: "", description: "", accentColor: "#9FB9FC" }])} />}
      >
        {v.pillars.length === 0 ? (
          <EmptyRow text="No pillars yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.pillars.map((pillar, i) => {
              const upd = (patch: Partial<ServicePillarItem>) => set(v.pillars.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
              return (
                <RepeaterItem key={i} onRemove={() => set(v.pillars.filter((_, idx) => idx !== i))}>
                  <div className="grid gap-3 sm:grid-cols-[4rem_1fr_9rem]">
                    <Field label="Letter"><TextInput value={pillar.letter} onChange={(x) => upd({ letter: x.slice(0, 1).toUpperCase() })} placeholder="M" /></Field>
                    <Field label="Name"><TextInput value={pillar.name} onChange={(x) => upd({ name: x })} placeholder="Mechanical" /></Field>
                    <ColorField label="Colour" value={pillar.accentColor} onChange={(x) => upd({ accentColor: x })} />
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
