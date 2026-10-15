"use client";

import { Field, SectionCard, TextArea, TextInput } from "@/components/admin/form-primitives";
import type { ServicesCtaContent } from "@/data/content-types";

export const EMPTY_SERVICES_CTA: ServicesCtaContent = {
  eyebrow: "",
  heading: "",
  intro: "",
  ctaLabel: "",
  ctaHref: "",
};

export function ServicesCtaForm({
  value,
  onChange,
}: {
  value: ServicesCtaContent | undefined;
  onChange: (next: ServicesCtaContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_SERVICES_CTA;
  const set = (patch: Partial<ServicesCtaContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Closing call-to-action" description="The 'Tell Us About Your Project' band above the footer.">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Get Started" /></Field>
          <Field label="Heading" hint="Use a line break (Enter) to split onto two lines.">
            <TextArea value={v.heading} onChange={(x) => set({ heading: x })} rows={2} />
          </Field>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={3} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Button label"><TextInput value={v.ctaLabel} onChange={(x) => set({ ctaLabel: x })} placeholder="Get a Free Consultation →" /></Field>
            <Field label="Button link"><TextInput value={v.ctaHref} onChange={(x) => set({ ctaHref: x })} placeholder="/contact" /></Field>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
