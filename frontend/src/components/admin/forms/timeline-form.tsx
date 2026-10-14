"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RepeaterItem,
  SectionCard,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { TimelineContent } from "@/data/content-types";

export const EMPTY_TIMELINE: TimelineContent = {
  eyebrow: "",
  headingLine1: "",
  headingHighlight: "",
  intro: "",
  milestones: [],
};

export function TimelineForm({
  value,
  onChange,
  slug,
}: {
  value: TimelineContent | undefined;
  onChange: (next: TimelineContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_TIMELINE;
  const set = (patch: Partial<TimelineContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Our Journey" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading line 1"><TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="16 Years of" /></Field>
            <Field label="Heading highlight"><TextInput value={v.headingHighlight} onChange={(x) => set({ headingHighlight: x })} placeholder="Engineering Growth" /></Field>
          </div>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={3} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Milestones"
        description="Each year on the timeline rail."
        action={<AddButton label="Add milestone" onClick={() => set({ milestones: [...v.milestones, { year: "", title: "", description: "", image: "" }] })} />}
      >
        {v.milestones.length === 0 ? (
          <EmptyRow text="No milestones yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.milestones.map((milestone, i) => {
              const upd = (patch: Partial<typeof milestone>) => set({ milestones: v.milestones.map((m, idx) => (idx === i ? { ...m, ...patch } : m)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ milestones: v.milestones.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[7rem_1fr]">
                    <Field label="Year"><TextInput value={milestone.year} onChange={(x) => upd({ year: x })} placeholder="2009" /></Field>
                    <Field label="Title"><TextInput value={milestone.title} onChange={(x) => upd({ title: x })} /></Field>
                  </div>
                  <Field label="Description"><TextArea value={milestone.description} onChange={(x) => upd({ description: x })} rows={2} /></Field>
                  <MediaField label="Image" kind="image" slug={slug} value={milestone.image ?? ""} onChange={(x) => upd({ image: x })} />
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
