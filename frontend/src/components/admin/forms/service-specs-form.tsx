"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  RemoveButton,
  SectionCard,
  TextInput,
} from "@/components/admin/form-primitives";
import type { ServiceSpecRow, ServiceSpecsSectionContent } from "@/data/content-types";

export const EMPTY_SERVICE_SPECS: ServiceSpecsSectionContent = { eyebrow: "", heading: "", rows: [] };

export function ServiceSpecsForm({
  value,
  onChange,
}: {
  value: ServiceSpecsSectionContent | undefined;
  onChange: (next: ServiceSpecsSectionContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_SERVICE_SPECS;
  const set = (patch: Partial<ServiceSpecsSectionContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} /></Field>
          <Field label="Heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Specification rows"
        description="The technical parameters table."
        action={<AddButton label="Add row" onClick={() => set({ rows: [...v.rows, { label: "", value: "" }] })} />}
      >
        {v.rows.length === 0 ? (
          <EmptyRow text="No rows yet — add one, or load the demo." />
        ) : (
          <div className="space-y-2">
            {v.rows.map((row, i) => {
              const upd = (patch: Partial<ServiceSpecRow>) => set({ rows: v.rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) });
              return (
                <div key={i} className="flex items-end gap-2">
                  <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                    <Field label="Label"><TextInput value={row.label} onChange={(x) => upd({ label: x })} placeholder="Voltage Classes" /></Field>
                    <Field label="Value"><TextInput value={row.value} onChange={(x) => upd({ value: x })} placeholder="33kV · 11kV · 0.415kV (LV)" /></Field>
                  </div>
                  <RemoveButton onClick={() => set({ rows: v.rows.filter((_, idx) => idx !== i) })} />
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
