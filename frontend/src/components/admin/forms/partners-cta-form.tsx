"use client";

import { Field, SectionCard, TextInput } from "@/components/admin/form-primitives";
import type { PartnersCtaContent } from "@/data/content-types";

export const EMPTY_PARTNERS_CTA: PartnersCtaContent = {
  eyebrow: "",
  heading: "",
  primaryLabel: "",
  primaryHref: "",
  secondaryLabel: "",
  secondaryHref: "",
};

export function PartnersCtaForm({
  value,
  onChange,
}: {
  value: PartnersCtaContent | undefined;
  onChange: (next: PartnersCtaContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PARTNERS_CTA;
  const set = (patch: Partial<PartnersCtaContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Closing call-to-action" description="The band above the footer, with a primary button and a text link.">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Work With BTEL" /></Field>
          <Field label="Heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} placeholder="Join Our Partners Program" /></Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-teal-light">Primary button</span>
              <Field label="Label"><TextInput value={v.primaryLabel} onChange={(x) => set({ primaryLabel: x })} placeholder="Start a Conversation →" /></Field>
              <Field label="Link"><TextInput value={v.primaryHref} onChange={(x) => set({ primaryHref: x })} placeholder="/contact" /></Field>
            </div>
            <div className="space-y-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-muted">Secondary link</span>
              <Field label="Label"><TextInput value={v.secondaryLabel} onChange={(x) => set({ secondaryLabel: x })} placeholder="See Our Projects →" /></Field>
              <Field label="Link"><TextInput value={v.secondaryHref} onChange={(x) => set({ secondaryHref: x })} placeholder="/projects" /></Field>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
