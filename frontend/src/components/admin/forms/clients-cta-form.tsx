"use client";

import { Field, SectionCard, TextArea, TextInput } from "@/components/admin/form-primitives";
import type { ClientsCtaContent } from "@/data/content-types";

export const EMPTY_CLIENTS_CTA: ClientsCtaContent = {
  eyebrow: "",
  headingLine1: "",
  headingLine2: "",
  body: "",
  primaryLabel: "",
  primaryHref: "",
  secondaryLabel: "",
  secondaryHref: "",
};

export function ClientsCtaForm({
  value,
  onChange,
}: {
  value: ClientsCtaContent | undefined;
  onChange: (next: ClientsCtaContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_CLIENTS_CTA;
  const set = (patch: Partial<ClientsCtaContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Closing CTA" description="The band at the foot of the page.">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Work With BTEL" /></Field>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">Heading</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Join Bangladesh's Most" />
              <TextInput value={v.headingLine2} onChange={(x) => set({ headingLine2: x })} placeholder="Trusted Client List" />
            </div>
          </div>
          <Field label="Body"><TextArea value={v.body} onChange={(x) => set({ body: x })} rows={2} /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Buttons">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Primary label"><TextInput value={v.primaryLabel} onChange={(x) => set({ primaryLabel: x })} placeholder="Start a Conversation →" /></Field>
            <Field label="Primary link"><TextInput value={v.primaryHref} onChange={(x) => set({ primaryHref: x })} placeholder="/contact" /></Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Secondary label"><TextInput value={v.secondaryLabel} onChange={(x) => set({ secondaryLabel: x })} placeholder="See Our Projects →" /></Field>
            <Field label="Secondary link"><TextInput value={v.secondaryHref} onChange={(x) => set({ secondaryHref: x })} placeholder="/projects" /></Field>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
