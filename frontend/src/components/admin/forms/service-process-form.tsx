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
import type { ServiceIconKey, ServiceProcessSectionContent, ServiceProcessStep } from "@/data/content-types";

export const EMPTY_SERVICE_PROCESS: ServiceProcessSectionContent = { eyebrow: "", heading: "", intro: "", steps: [] };

// Shared by solar's "EPC process" and after-sales' "service process" strips.
// `showIcon` turns on the per-step icon + colour (after-sales); solar's
// numbered-circle version leaves it off.
export function ServiceProcessForm({
  value,
  onChange,
  showIcon = false,
  showActive = false,
}: {
  value: ServiceProcessSectionContent | undefined;
  onChange: (next: ServiceProcessSectionContent) => void;
  slug: string;
  showIcon?: boolean;
  showActive?: boolean;
}) {
  const v = value ?? EMPTY_SERVICE_PROCESS;
  const set = (patch: Partial<ServiceProcessSectionContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} /></Field>
          <Field label="Heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} /></Field>
          <Field label="Intro (optional)"><TextArea value={v.intro ?? ""} onChange={(x) => set({ intro: x })} rows={2} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Steps"
        description="Shown left to right in order."
        action={<AddButton label="Add step" onClick={() => set({ steps: [...v.steps, { title: "", description: "" }] })} />}
      >
        {v.steps.length === 0 ? (
          <EmptyRow text="No steps yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.steps.map((step, i) => {
              const upd = (patch: Partial<ServiceProcessStep>) => set({ steps: v.steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ steps: v.steps.filter((_, idx) => idx !== i) })}>
                  <Field label="Title"><TextInput value={step.title} onChange={(x) => upd({ title: x })} /></Field>
                  <Field label="Description"><TextArea value={step.description} onChange={(x) => upd({ description: x })} rows={2} /></Field>
                  {showIcon ? (
                    <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                      <Field label="Icon">
                        <Select value={step.icon ?? "bolt"} onChange={(x) => upd({ icon: x as ServiceIconKey })} options={SERVICE_ICON_OPTIONS} />
                      </Field>
                      <ColorField label="Colour" value={step.accentColor ?? "#0A9E88"} onChange={(x) => upd({ accentColor: x })} />
                    </div>
                  ) : null}
                  {showActive ? (
                    <label className="flex items-center gap-2 text-xs font-medium text-muted">
                      <input type="checkbox" checked={!!step.active} onChange={(e) => upd({ active: e.target.checked })} />
                      Highlight this step (currently active phase)
                    </label>
                  ) : null}
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
