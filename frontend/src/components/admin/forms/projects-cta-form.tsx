"use client";

import { Field, SectionCard, TextArea, TextInput } from "@/components/admin/form-primitives";
import type { ProjectsCtaContent } from "@/data/content-types";

export const EMPTY_PROJECTS_CTA: ProjectsCtaContent = {
  eyebrow: "",
  headingLine1: "",
  headingLine2: "",
  intro: "",
  ctaLabel: "",
  ctaHref: "",
};

export function ProjectsCtaForm({
  value,
  onChange,
}: {
  value: ProjectsCtaContent | undefined;
  onChange: (next: ProjectsCtaContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PROJECTS_CTA;
  const set = (patch: Partial<ProjectsCtaContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Closing call-to-action" description="The band above the footer.">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Start Your Project" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading line 1"><TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Let's Add Your Project" /></Field>
            <Field label="Heading line 2"><TextInput value={v.headingLine2} onChange={(x) => set({ headingLine2: x })} placeholder="to This Portfolio" /></Field>
          </div>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={3} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Button label"><TextInput value={v.ctaLabel} onChange={(x) => set({ ctaLabel: x })} placeholder="Request a Quotation →" /></Field>
            <Field label="Button link"><TextInput value={v.ctaHref} onChange={(x) => set({ ctaHref: x })} placeholder="/contact" /></Field>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
