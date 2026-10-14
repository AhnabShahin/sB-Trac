"use client";

import { Field, SectionCard, TextArea, TextInput } from "@/components/admin/form-primitives";
import type { PartnerCtaContent } from "@/data/content-types";

export const EMPTY_PARTNER_CTA: PartnerCtaContent = {
  eyebrow: "",
  headingLine1: "",
  headingLine2: "",
  body: "",
  ctaLabel: "",
  ctaHref: "",
};

export function PartnerCtaForm({
  value,
  onChange,
}: {
  value: PartnerCtaContent | undefined;
  onChange: (next: PartnerCtaContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PARTNER_CTA;
  const set = (patch: Partial<PartnerCtaContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Closing call-to-action" description="The 'Ready to Partner?' band above the footer.">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Ready to Partner?" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading line 1"><TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Let's Engineer Your Next Project" /></Field>
            <Field label="Heading line 2"><TextInput value={v.headingLine2} onChange={(x) => set({ headingLine2: x })} placeholder="From Design to Commissioning" /></Field>
          </div>
          <Field label="Body"><TextArea value={v.body} onChange={(x) => set({ body: x })} rows={4} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Button label"><TextInput value={v.ctaLabel} onChange={(x) => set({ ctaLabel: x })} placeholder="Explore Products & Services →" /></Field>
            <Field label="Button link"><TextInput value={v.ctaHref} onChange={(x) => set({ ctaHref: x })} placeholder="/products-services" /></Field>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
