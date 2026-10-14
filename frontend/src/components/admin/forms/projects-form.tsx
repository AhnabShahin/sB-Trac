"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RepeaterItem,
  SectionCard,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { ProjectsContent } from "@/data/content-types";

export const EMPTY_PROJECTS: ProjectsContent = {
  eyebrow: "",
  headingLine1: "",
  headingLine2: "",
  cards: [],
};

const ACCENTS = [
  { value: "teal", label: "Teal" },
  { value: "blue", label: "Blue" },
  { value: "amber", label: "Amber" },
  { value: "purple", label: "Purple" },
  { value: "cyan", label: "Cyan" },
];

export function ProjectsForm({
  value,
  onChange,
  slug,
}: {
  value: ProjectsContent | undefined;
  onChange: (next: ProjectsContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PROJECTS;
  const set = (patch: Partial<ProjectsContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Project Portfolio" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading line 1"><TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Work That Speaks" /></Field>
            <Field label="Heading line 2"><TextInput value={v.headingLine2} onChange={(x) => set({ headingLine2: x })} placeholder="For Itself" /></Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Portfolio cards"
        description="The division tiles. Leave the highlight title blank to show 'Value details available on request'."
        action={<AddButton label="Add card" onClick={() => set({ cards: [...v.cards, { categoryLabel: "", accent: "teal", count: "", countSuffix: "projects", highlightLabel: "Highest Value", title: "", metric: "", href: "", image: "" }] })} />}
      >
        {v.cards.length === 0 ? (
          <EmptyRow text="No cards yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.cards.map((card, i) => {
              const upd = (patch: Partial<typeof card>) => set({ cards: v.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ cards: v.cards.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
                    <Field label="Category label"><TextInput value={card.categoryLabel} onChange={(x) => upd({ categoryLabel: x })} placeholder="Substation & Switchgear" /></Field>
                    <Field label="Accent"><Select value={card.accent} onChange={(x) => upd({ accent: x as typeof card.accent })} options={ACCENTS} /></Field>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[6rem_1fr]">
                    <Field label="Count"><TextInput value={card.count} onChange={(x) => upd({ count: x })} placeholder="266+" /></Field>
                    <Field label="Count suffix"><TextInput value={card.countSuffix} onChange={(x) => upd({ countSuffix: x })} placeholder="projects" /></Field>
                  </div>
                  <Field label="Link"><TextInput value={card.href} onChange={(x) => upd({ href: x })} placeholder="/projects?filter=substation#portfolio" /></Field>
                  <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
                    <Field label="Highlight label"><TextInput value={card.highlightLabel} onChange={(x) => upd({ highlightLabel: x })} placeholder="Highest Value" /></Field>
                    <Field label="Metric"><TextInput value={card.metric} onChange={(x) => upd({ metric: x })} placeholder="BDT 5.82 Cr" /></Field>
                  </div>
                  <Field label="Highlight title (optional)"><TextArea value={card.title} onChange={(x) => upd({ title: x })} rows={2} /></Field>
                  <MediaField label="Background image" kind="image" slug={slug} value={card.image ?? ""} onChange={(x) => upd({ image: x })} />
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
