"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RemoveButton,
  SectionCard,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { ServicesHeroContent } from "@/data/content-types";

export const EMPTY_SERVICES_HERO: ServicesHeroContent = {
  badge: "",
  headingPrefix: "",
  headingHighlight: "",
  headingSuffix: "",
  subhead: "",
  banners: [],
};

export function ServicesHeroForm({
  value,
  onChange,
  slug,
}: {
  value: ServicesHeroContent | undefined;
  onChange: (next: ServicesHeroContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_SERVICES_HERO;
  const set = (patch: Partial<ServicesHeroContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Hero heading" description="The page banner: badge, big heading and intro.">
        <div className="space-y-4">
          <Field label="Badge"><TextInput value={v.badge} onChange={(x) => set({ badge: x })} placeholder="5 Divisions · ISO 9001:2015" /></Field>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">Heading</span>
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput value={v.headingPrefix} onChange={(x) => set({ headingPrefix: x })} placeholder="Products " />
              <TextInput value={v.headingHighlight} onChange={(x) => set({ headingHighlight: x })} placeholder="& (teal)" />
              <TextInput value={v.headingSuffix} onChange={(x) => set({ headingSuffix: x })} placeholder=" Services" />
            </div>
          </div>
          <Field label="Intro"><TextArea value={v.subhead} onChange={(x) => set({ subhead: x })} rows={3} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Background banners"
        description="Full-bleed images that crossfade behind the hero."
        action={<AddButton label="Add banner" onClick={() => set({ banners: [...v.banners, ""] })} />}
      >
        {v.banners.length === 0 ? (
          <EmptyRow text="No banners yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.banners.map((banner, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <MediaField label={`Banner ${i + 1}`} kind="image" slug={slug} value={banner} onChange={(x) => set({ banners: v.banners.map((b, idx) => (idx === i ? x : b)) })} />
                </div>
                <div className="pt-6">
                  <RemoveButton onClick={() => set({ banners: v.banners.filter((_, idx) => idx !== i) })} />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
