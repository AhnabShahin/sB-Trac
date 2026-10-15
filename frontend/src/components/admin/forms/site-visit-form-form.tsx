"use client";

import { Field, SectionCard, StringListField, TextInput } from "@/components/admin/form-primitives";
import type { SiteVisitFormContent } from "@/data/content-types";

export const EMPTY_SITE_VISIT_FORM: SiteVisitFormContent = {
  tabSiteVisitLabel: "",
  tabInquiryLabel: "",
  heading: "",
  submitLabel: "",
  successTitle: "",
  successBody: "",
  siteTypeOptions: [],
};

// The "Book a Free Site Visit" form's copy — tab labels, heading, submit
// button, success message and the Site Type dropdown choices. The form
// mechanics (name/phone/email/… fields) stay fixed; only the text around them
// is admin-editable, matching the contact form's pattern.
export function SiteVisitFormForm({
  value,
  onChange,
}: {
  value: SiteVisitFormContent | undefined;
  onChange: (next: SiteVisitFormContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_SITE_VISIT_FORM;
  const set = (patch: Partial<SiteVisitFormContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Tabs">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Site-visit tab label"><TextInput value={v.tabSiteVisitLabel} onChange={(x) => set({ tabSiteVisitLabel: x })} placeholder="Book a Free Site Visit" /></Field>
          <Field label="Inquiry tab label"><TextInput value={v.tabInquiryLabel} onChange={(x) => set({ tabInquiryLabel: x })} placeholder="General Inquiry" /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Form copy">
        <div className="space-y-4">
          <Field label="Form heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} placeholder="Schedule Your Free Site Visit" /></Field>
          <Field label="Submit button label"><TextInput value={v.submitLabel} onChange={(x) => set({ submitLabel: x })} placeholder="Book Free Site Visit →" /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Success message" description="Shown after a visitor submits.">
        <div className="space-y-4">
          <Field label="Title"><TextInput value={v.successTitle} onChange={(x) => set({ successTitle: x })} placeholder="Site Visit Requested" /></Field>
          <Field label="Body"><TextInput value={v.successBody} onChange={(x) => set({ successBody: x })} /></Field>
        </div>
      </SectionCard>

      <StringListField
        title="Site type options"
        description="The 'Site Type' dropdown choices."
        items={v.siteTypeOptions}
        onChange={(siteTypeOptions) => set({ siteTypeOptions })}
        placeholder="Rooftop"
      />
    </div>
  );
}
