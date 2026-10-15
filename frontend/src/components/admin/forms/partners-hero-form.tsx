"use client";

import { Field, MediaField, SectionCard, Select, TextArea, TextInput } from "@/components/admin/form-primitives";
import type { PartnersHeroContent, ProjectsAccent } from "@/data/content-types";
import { ACCENT_OPTIONS } from "@/components/admin/forms/projects-hero-form";

export const EMPTY_PARTNERS_HERO: PartnersHeroContent = {
  accent: "teal",
  badge: "",
  headingLine1: "",
  headingHighlight: "",
  subhead: "",
  image: "",
};

export function PartnersHeroForm({
  value,
  onChange,
  slug,
}: {
  value: PartnersHeroContent | undefined;
  onChange: (next: PartnersHeroContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PARTNERS_HERO;
  const set = (patch: Partial<PartnersHeroContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Hero heading" description="The page banner — badge, heading and intro.">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
            <Field label="Badge"><TextInput value={v.badge} onChange={(x) => set({ badge: x })} placeholder="30 Global Brands · 60+ Clients" /></Field>
            <Field label="Accent colour"><Select value={v.accent} onChange={(x) => set({ accent: x as ProjectsAccent })} options={ACCENT_OPTIONS} /></Field>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">Heading</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="World-Class" />
              <TextInput value={v.headingHighlight} onChange={(x) => set({ headingHighlight: x })} placeholder="Partners. (accent)" />
            </div>
          </div>
          <Field label="Intro"><TextArea value={v.subhead} onChange={(x) => set({ subhead: x })} rows={3} /></Field>
          <MediaField label="Background image" kind="image" slug={slug} value={v.image} onChange={(x) => set({ image: x })} />
        </div>
      </SectionCard>
    </div>
  );
}
