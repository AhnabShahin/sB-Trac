"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RemoveButton,
  RepeaterItem,
  SectionCard,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import { ACCENT_OPTIONS } from "@/components/admin/forms/projects-hero-form";
import type { ServiceAccent, ServiceHeroCta, ServiceSubHeroContent, ServiceSubHeroStat } from "@/data/content-types";

export const EMPTY_SERVICE_HERO: ServiceSubHeroContent = {
  accent: "teal",
  badge: "",
  breadcrumbLabel: "",
  headingLine1: "",
  headingHighlight: "",
  headingSuffix: "",
  subhead: "",
  image: "",
  stats: [],
};

// Shared by every products-services sub-page (substation, solar, mep,
// water-treatment, after-sales) — the hero banner shape is identical across
// all five; only the copy, accent colour and optional stats/CTAs differ.
export function ServiceHeroForm({
  value,
  onChange,
  slug,
}: {
  value: ServiceSubHeroContent | undefined;
  onChange: (next: ServiceSubHeroContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_SERVICE_HERO;
  const set = (patch: Partial<ServiceSubHeroContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Hero heading" description="The page banner — badge, heading and intro.">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
            <Field label="Badge"><TextInput value={v.badge} onChange={(x) => set({ badge: x })} placeholder="Service Division 01 · 33kV & 11kV Substation EPC" /></Field>
            <Field label="Accent colour"><Select value={v.accent} onChange={(x) => set({ accent: x as ServiceAccent })} options={ACCENT_OPTIONS} /></Field>
          </div>
          <Field label="Breadcrumb label"><TextInput value={v.breadcrumbLabel} onChange={(x) => set({ breadcrumbLabel: x })} placeholder="Substation & Switchgear" /></Field>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">Heading</span>
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Substation &" />
              <TextInput value={v.headingHighlight} onChange={(x) => set({ headingHighlight: x })} placeholder="Switchgear Systems (gradient)" />
              <TextInput value={v.headingSuffix ?? ""} onChange={(x) => set({ headingSuffix: x })} placeholder="Optional suffix" />
            </div>
          </div>
          <Field label="Intro"><TextArea value={v.subhead} onChange={(x) => set({ subhead: x })} rows={3} /></Field>
          <MediaField label="Background image" kind="image" slug={slug} value={v.image} onChange={(x) => set({ image: x })} />
        </div>
      </SectionCard>

      <SectionCard
        title="Stat row"
        description="Small numbers below the intro (optional — leave empty to hide)."
        action={<AddButton label="Add stat" onClick={() => set({ stats: [...v.stats, { value: "", unit: "", label: "" }] })} />}
      >
        {v.stats.length === 0 ? (
          <EmptyRow text="No stats yet." />
        ) : (
          <div className="space-y-3">
            {v.stats.map((stat, i) => {
              const upd = (patch: Partial<ServiceSubHeroStat>) => set({ stats: v.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ stats: v.stats.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[6rem_5rem_1fr]">
                    <Field label="Value"><TextInput value={stat.value} onChange={(x) => upd({ value: x })} placeholder="20" /></Field>
                    <Field label="Unit"><TextInput value={stat.unit ?? ""} onChange={(x) => upd({ unit: x })} placeholder="MVA" /></Field>
                    <Field label="Label"><TextInput value={stat.label} onChange={(x) => upd({ label: x })} placeholder="Max Transformer Range" /></Field>
                  </div>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Hero buttons" description="Optional call-to-action buttons (leave label empty to hide).">
        <div className="grid gap-4 sm:grid-cols-2">
          {(["primaryCta", "secondaryCta"] as const).map((key) => {
            const cta: ServiceHeroCta = v[key] ?? { label: "", href: "" };
            return (
              <div key={key} className="space-y-2 rounded-xl border border-border/60 bg-navy/40 p-3">
                <Field label={key === "primaryCta" ? "Primary label" : "Secondary label"}>
                  <TextInput value={cta.label} onChange={(x) => set({ [key]: { ...cta, label: x } })} placeholder="Book Free Site Visit" />
                </Field>
                <Field label="Link">
                  <TextInput value={cta.href} onChange={(x) => set({ [key]: { ...cta, href: x } })} placeholder="#site-visit" />
                </Field>
                {cta.label ? (
                  <RemoveButton onClick={() => set({ [key]: undefined })} />
                ) : null}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
