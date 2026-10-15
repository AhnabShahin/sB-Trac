"use client";

import { Field, MediaField, SectionCard, TextArea, TextInput } from "@/components/admin/form-primitives";
import type { ServiceCtaContent } from "@/data/content-types";

export const EMPTY_SERVICE_CTA: ServiceCtaContent = { eyebrow: "", headingLine1: "", headingLine2: "", intro: "" };

// Shared small copy block, reused for solar's "Book a site visit" intro and
// its closing banner strip.
export function ServiceCtaForm({
  value,
  onChange,
  slug,
  showImage = false,
  showButton = false,
}: {
  value: ServiceCtaContent | undefined;
  onChange: (next: ServiceCtaContent) => void;
  slug: string;
  showImage?: boolean;
  showButton?: boolean;
}) {
  const v = value ?? EMPTY_SERVICE_CTA;
  const set = (patch: Partial<ServiceCtaContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Copy">
        <div className="space-y-4">
          <Field label="Eyebrow (optional)"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading line 1"><TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} /></Field>
            <Field label="Heading line 2 (optional)"><TextInput value={v.headingLine2 ?? ""} onChange={(x) => set({ headingLine2: x })} /></Field>
          </div>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={3} /></Field>
          {showImage ? (
            <MediaField label="Banner image" kind="image" slug={slug} value={v.image ?? ""} onChange={(x) => set({ image: x })} />
          ) : null}
          {showButton ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Button label"><TextInput value={v.ctaLabel ?? ""} onChange={(x) => set({ ctaLabel: x })} /></Field>
              <Field label="Button link"><TextInput value={v.ctaHref ?? ""} onChange={(x) => set({ ctaHref: x })} /></Field>
            </div>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
}
