"use client";

import { Field, SectionCard, StringListField, TextInput } from "@/components/admin/form-primitives";
import type { ServiceBrandsSectionContent } from "@/data/content-types";

export const EMPTY_MEP_BRANDS: ServiceBrandsSectionContent = { eyebrow: "", heading: "", brands: [] };

export function MepBrandsForm({
  value,
  onChange,
}: {
  value: ServiceBrandsSectionContent | undefined;
  onChange: (next: ServiceBrandsSectionContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_MEP_BRANDS;
  const set = (patch: Partial<ServiceBrandsSectionContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} /></Field>
          <Field label="Heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} /></Field>
        </div>
      </SectionCard>

      <StringListField
        title="Equipment brands"
        description="The brand-name chips."
        items={v.brands}
        onChange={(brands) => set({ brands })}
        placeholder="Caterpillar (CAT)"
      />
    </div>
  );
}
