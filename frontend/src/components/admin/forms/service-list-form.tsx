"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RepeaterItem,
  SectionCard,
  Select,
  TextArea,
  TextInput,
  inputCls,
} from "@/components/admin/form-primitives";
import type { ServiceListContent, ServiceRow } from "@/data/content-types";

export const EMPTY_SERVICE_LIST: ServiceListContent = {
  eyebrow: "",
  heading: "",
  intro: "",
  services: [],
};

const ICONS = [
  { value: "bolt", label: "Bolt" },
  { value: "sun", label: "Sun" },
  { value: "wrench", label: "Wrench" },
  { value: "droplet", label: "Droplet" },
  { value: "clock", label: "Clock" },
];

export function ServiceListForm({
  value,
  onChange,
  slug,
}: {
  value: ServiceListContent | undefined;
  onChange: (next: ServiceListContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_SERVICE_LIST;
  const set = (patch: Partial<ServiceListContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="All Divisions" /></Field>
          <Field label="Heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} placeholder="Five Service Divisions" /></Field>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={2} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Service divisions"
        description="Each row in the divisions list."
        action={<AddButton label="Add division" onClick={() => set({ services: [...v.services, { index: "", title: "", description: "", tags: [], icon: "bolt", href: "", image: "" }] })} />}
      >
        {v.services.length === 0 ? (
          <EmptyRow text="No divisions yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.services.map((service, i) => {
              const upd = (patch: Partial<ServiceRow>) => set({ services: v.services.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ services: v.services.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[5rem_1fr_9rem]">
                    <Field label="Index"><TextInput value={service.index} onChange={(x) => upd({ index: x })} placeholder="01" /></Field>
                    <Field label="Title"><TextInput value={service.title} onChange={(x) => upd({ title: x })} /></Field>
                    <Field label="Icon"><Select value={service.icon} onChange={(x) => upd({ icon: x as ServiceRow["icon"] })} options={ICONS} /></Field>
                  </div>
                  <Field label="Description"><TextArea value={service.description} onChange={(x) => upd({ description: x })} rows={2} /></Field>
                  <Field label="Tags" hint="Comma-separated.">
                    <input
                      className={inputCls}
                      value={service.tags.join(", ")}
                      placeholder="11kV–132kV, EPC, SCADA"
                      onChange={(e) => upd({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                    />
                  </Field>
                  <Field label="Link"><TextInput value={service.href} onChange={(x) => upd({ href: x })} placeholder="/products-services/substation" /></Field>
                  <MediaField label="Hover image" kind="image" slug={slug} value={service.image} onChange={(x) => upd({ image: x })} />
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
