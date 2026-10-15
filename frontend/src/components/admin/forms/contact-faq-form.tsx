"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  RepeaterItem,
  SectionCard,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { ContactFaqContent, ContactFaqItem } from "@/data/content-types";

export const EMPTY_CONTACT_FAQ: ContactFaqContent = {
  eyebrow: "",
  heading: "",
  intro: "",
  faqs: [],
};

export function ContactFaqForm({
  value,
  onChange,
}: {
  value: ContactFaqContent | undefined;
  onChange: (next: ContactFaqContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_CONTACT_FAQ;
  const set = (patch: Partial<ContactFaqContent>) => onChange({ ...v, ...patch });
  const setFaqs = (faqs: ContactFaqItem[]) => set({ faqs });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Common Questions" /></Field>
          <Field label="Heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} placeholder="Frequently Asked" /></Field>
          <Field label="Intro"><TextInput value={v.intro} onChange={(x) => set({ intro: x })} placeholder="Quick answers before reaching out." /></Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Questions"
        description="Accordion items."
        action={<AddButton label="Add question" onClick={() => setFaqs([...v.faqs, { question: "", answer: "" }])} />}
      >
        {v.faqs.length === 0 ? (
          <EmptyRow text="No questions yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.faqs.map((faq, i) => {
              const upd = (patch: Partial<ContactFaqItem>) => setFaqs(v.faqs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
              return (
                <RepeaterItem key={i} onRemove={() => setFaqs(v.faqs.filter((_, idx) => idx !== i))}>
                  <Field label="Question"><TextInput value={faq.question} onChange={(x) => upd({ question: x })} /></Field>
                  <Field label="Answer"><TextArea value={faq.answer} onChange={(x) => upd({ answer: x })} rows={3} /></Field>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
