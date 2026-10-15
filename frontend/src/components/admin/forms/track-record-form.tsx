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
import type { ProjectsAccent, TrackRecordCardContent, TrackRecordContent } from "@/data/content-types";
import { ACCENT_OPTIONS } from "@/components/admin/forms/projects-hero-form";

export const EMPTY_TRACK_RECORD: TrackRecordContent = {
  eyebrow: "",
  headingLine1: "",
  headingLine2: "",
  cards: [],
};

const FILTERS = [
  { value: "mep", label: "MEP / EPC" },
  { value: "solar", label: "Solar" },
  { value: "substation", label: "Substation" },
  { value: "water-treatment", label: "Water Treatment" },
];

export function TrackRecordForm({
  value,
  onChange,
}: {
  value: TrackRecordContent | undefined;
  onChange: (next: TrackRecordContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_TRACK_RECORD;
  const set = (patch: Partial<TrackRecordContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Track Record" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading line 1"><TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Proven Across" /></Field>
            <Field label="Heading line 2"><TextInput value={v.headingLine2} onChange={(x) => set({ headingLine2: x })} placeholder="Every Division" /></Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Track record cards"
        description="Each card filters the portfolio below. The accent sets its number + top-border colour."
        action={<AddButton label="Add card" onClick={() => set({ cards: [...v.cards, { tag: "", accent: "teal", filter: "mep", title: "", description: "" }] })} />}
      >
        {v.cards.length === 0 ? (
          <EmptyRow text="No cards yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.cards.map((card, i) => {
              const upd = (patch: Partial<TrackRecordCardContent>) => set({ cards: v.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ cards: v.cards.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_8rem_9rem]">
                    <Field label="Tag"><TextInput value={card.tag} onChange={(x) => upd({ tag: x })} placeholder="MEP" /></Field>
                    <Field label="Accent"><Select value={card.accent} onChange={(x) => upd({ accent: x as ProjectsAccent })} options={ACCENT_OPTIONS} /></Field>
                    <Field label="Filters to"><Select value={card.filter} onChange={(x) => upd({ filter: x })} options={FILTERS} /></Field>
                  </div>
                  <Field label="Title"><TextInput value={card.title} onChange={(x) => upd({ title: x })} /></Field>
                  <Field label="Description"><TextArea value={card.description} onChange={(x) => upd({ description: x })} rows={3} /></Field>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
