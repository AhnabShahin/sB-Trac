"use client";

import {
  AddButton,
  ColorField,
  EmptyRow,
  Field,
  RepeaterItem,
  SectionCard,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import { SERVICE_ICON_OPTIONS } from "@/lib/service-icons";
import type { AfterSalesContactOption, AfterSalesCtaContent, ServiceIconKey } from "@/data/content-types";

export const EMPTY_AFTER_SALES_CTA: AfterSalesCtaContent = {
  eyebrow: "",
  headingLine1: "",
  headingLine2: "",
  intro: "",
  options: [],
  ctaLabel: "",
  ctaHref: "",
};

export function AfterSalesCtaForm({
  value,
  onChange,
}: {
  value: AfterSalesCtaContent | undefined;
  onChange: (next: AfterSalesCtaContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_AFTER_SALES_CTA;
  const set = (patch: Partial<AfterSalesCtaContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Copy">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading line 1"><TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} /></Field>
            <Field label="Heading line 2 (optional)"><TextInput value={v.headingLine2 ?? ""} onChange={(x) => set({ headingLine2: x })} /></Field>
          </div>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={2} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Button label"><TextInput value={v.ctaLabel} onChange={(x) => set({ ctaLabel: x })} placeholder="Submit a Service Request Online →" /></Field>
            <Field label="Button link"><TextInput value={v.ctaHref} onChange={(x) => set({ ctaHref: x })} placeholder="/contact" /></Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Contact options"
        description="The two contact tiles (e.g. WhatsApp emergency line, service email)."
        action={<AddButton label="Add option" onClick={() => set({ options: [...v.options, { icon: "phone", title: "", description: "", value: "", href: "", accentColor: "#0A9E88" }] })} />}
      >
        {v.options.length === 0 ? (
          <EmptyRow text="No options yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.options.map((option, i) => {
              const upd = (patch: Partial<AfterSalesContactOption>) => set({ options: v.options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ options: v.options.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                    <Field label="Icon">
                      <Select value={option.icon} onChange={(x) => upd({ icon: x as ServiceIconKey })} options={SERVICE_ICON_OPTIONS} />
                    </Field>
                    <ColorField label="Colour" value={option.accentColor} onChange={(x) => upd({ accentColor: x })} />
                  </div>
                  <Field label="Title"><TextInput value={option.title} onChange={(x) => upd({ title: x })} placeholder="Emergency Line" /></Field>
                  <Field label="Description"><TextInput value={option.description} onChange={(x) => upd({ description: x })} placeholder="Available 24/7 for critical failures" /></Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Displayed value"><TextInput value={option.value} onChange={(x) => upd({ value: x })} placeholder="+88 01755-515151" /></Field>
                    <Field label="Link"><TextInput value={option.href} onChange={(x) => upd({ href: x })} placeholder="https://wa.me/8801755515151" /></Field>
                  </div>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
