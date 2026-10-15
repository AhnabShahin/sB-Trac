"use client";

import {
  Field,
  SectionCard,
  StringListField,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { ContactFormContent } from "@/data/content-types";

export const EMPTY_CONTACT_FORM: ContactFormContent = {
  heading: "",
  intro: "",
  services: [],
  budgets: [],
  consentLabel: "",
  submitLabel: "",
  footnote: "",
  successTitle: "",
  successBody: "",
};

export function ContactFormForm({
  value,
  onChange,
}: {
  value: ContactFormContent | undefined;
  onChange: (next: ContactFormContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_CONTACT_FORM;
  const set = (patch: Partial<ContactFormContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Form copy" description="Headings and labels on the inquiry form.">
        <div className="space-y-4">
          <Field label="Heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} placeholder="Send an Inquiry" /></Field>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={2} /></Field>
          <Field label="Consent checkbox label"><TextArea value={v.consentLabel} onChange={(x) => set({ consentLabel: x })} rows={2} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Submit button label"><TextInput value={v.submitLabel} onChange={(x) => set({ submitLabel: x })} placeholder="Submit Inquiry →" /></Field>
            <Field label="Footnote"><TextInput value={v.footnote} onChange={(x) => set({ footnote: x })} placeholder="We typically respond within 24 hours" /></Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Success message" description="Shown after a visitor submits.">
        <div className="space-y-4">
          <Field label="Title"><TextInput value={v.successTitle} onChange={(x) => set({ successTitle: x })} placeholder="Inquiry Received" /></Field>
          <Field label="Body"><TextArea value={v.successBody} onChange={(x) => set({ successBody: x })} rows={2} /></Field>
        </div>
      </SectionCard>

      <StringListField
        title="Service options"
        description="The 'Service Required' dropdown choices."
        items={v.services}
        onChange={(services) => set({ services })}
        placeholder="Substation & Switchgear Systems"
      />

      <StringListField
        title="Budget options"
        description="The 'Project Budget' dropdown choices."
        items={v.budgets}
        onChange={(budgets) => set({ budgets })}
        placeholder="1 Cr – 5 Cr"
      />
    </div>
  );
}
