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
import type { PartnerLogo, PartnerWallContent } from "@/data/content-types";

export const EMPTY_PARTNER_WALL: PartnerWallContent = {
  eyebrow: "",
  heading: "",
  description: "",
  logos: [],
};

export function PartnerWallForm({
  value,
  onChange,
  slug,
}: {
  value: PartnerWallContent | undefined;
  onChange: (next: PartnerWallContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PARTNER_WALL;
  const set = (patch: Partial<PartnerWallContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Global Partnerships" /></Field>
          <Field label="Heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} placeholder="Partner Brands" /></Field>
          <Field label="Description"><TextArea value={v.description} onChange={(x) => set({ description: x })} rows={2} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Partner logos"
        description="Each brand mark on the wall."
        action={<AddButton label="Add logo" onClick={() => set({ logos: [...v.logos, { name: "", logo: "" }] })} />}
      >
        {v.logos.length === 0 ? (
          <EmptyRow text="No logos yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.logos.map((logo, i) => {
              const upd = (patch: Partial<PartnerLogo>) => set({ logos: v.logos.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) });
              return (
                <div key={i} className="rounded-xl border border-border/60 bg-navy/40 p-3">
                  <div className="mb-2 flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <Field label={`Brand name ${i + 1}`}><TextInput value={logo.name} onChange={(x) => upd({ name: x })} placeholder="ABB" /></Field>
                    </div>
                    <RemoveButton onClick={() => set({ logos: v.logos.filter((_, idx) => idx !== i) })} />
                  </div>
                  <MediaField label="Logo" kind="image" slug={slug} value={logo.logo} onChange={(x) => upd({ logo: x })} />
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
