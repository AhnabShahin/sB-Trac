"use client";

import {
  AddButton,
  ColorField,
  EmptyRow,
  Field,
  RepeaterItem,
  SectionCard,
  Select,
  StringListField,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import { SERVICE_ICON_OPTIONS } from "@/lib/service-icons";
import type { AfterSalesRegionsContent, ServiceCardItem, ServiceIconKey } from "@/data/content-types";

export const EMPTY_AFTER_SALES_COVERAGE: AfterSalesRegionsContent = {
  cardHeading: "",
  cardIntro: "",
  headingLine1: "",
  headingLine2: "",
  intro: "",
  regions: [],
  points: [],
};

export function AfterSalesCoverageForm({
  value,
  onChange,
}: {
  value: AfterSalesRegionsContent | undefined;
  onChange: (next: AfterSalesRegionsContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_AFTER_SALES_COVERAGE;
  const set = (patch: Partial<AfterSalesRegionsContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Coverage card" description="The “BD / Nationwide Coverage” tile.">
        <div className="space-y-4">
          <Field label="Card heading"><TextInput value={v.cardHeading} onChange={(x) => set({ cardHeading: x })} placeholder="NATIONWIDE COVERAGE" /></Field>
          <Field label="Card intro"><TextArea value={v.cardIntro} onChange={(x) => set({ cardIntro: x })} rows={2} /></Field>
        </div>
      </SectionCard>

      <SectionCard title="Coverage copy">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Heading line 1"><TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} /></Field>
            <Field label="Heading line 2 (optional)"><TextInput value={v.headingLine2 ?? ""} onChange={(x) => set({ headingLine2: x })} /></Field>
          </div>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={2} /></Field>
        </div>
      </SectionCard>

      <StringListField
        title="Regions"
        description="City / region chips inside the coverage card."
        items={v.regions}
        onChange={(regions) => set({ regions })}
        placeholder="Dhaka"
      />

      <SectionCard
        title="Coverage points"
        description="The icon rows beside the coverage copy."
        action={<AddButton label="Add point" onClick={() => set({ points: [...v.points, { icon: "factory", title: "", description: "", accentColor: "#9FB9FC" }] })} />}
      >
        {v.points.length === 0 ? (
          <EmptyRow text="No points yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.points.map((point, i) => {
              const upd = (patch: Partial<ServiceCardItem>) => set({ points: v.points.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ points: v.points.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                    <Field label="Icon">
                      <Select value={point.icon} onChange={(x) => upd({ icon: x as ServiceIconKey })} options={SERVICE_ICON_OPTIONS} />
                    </Field>
                    <ColorField label="Colour" value={point.accentColor} onChange={(x) => upd({ accentColor: x })} />
                  </div>
                  <Field label="Title"><TextInput value={point.title} onChange={(x) => upd({ title: x })} /></Field>
                  <Field label="Description"><TextArea value={point.description} onChange={(x) => upd({ description: x })} rows={2} /></Field>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
