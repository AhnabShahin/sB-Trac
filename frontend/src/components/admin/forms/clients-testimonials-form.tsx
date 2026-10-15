"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  RepeaterItem,
  SectionCard,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { ClientTestimonialItem, ClientsTestimonialsContent } from "@/data/content-types";

export const EMPTY_CLIENTS_TESTIMONIALS: ClientsTestimonialsContent = {
  eyebrow: "",
  headingLine1: "",
  headingHighlight: "",
  items: [],
};

export function ClientsTestimonialsForm({
  value,
  onChange,
}: {
  value: ClientsTestimonialsContent | undefined;
  onChange: (next: ClientsTestimonialsContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_CLIENTS_TESTIMONIALS;
  const set = (patch: Partial<ClientsTestimonialsContent>) => onChange({ ...v, ...patch });
  const setItems = (items: ClientTestimonialItem[]) => set({ items });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="What Clients Say" /></Field>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">Heading</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Built on Trust &" />
              <TextInput value={v.headingHighlight} onChange={(x) => set({ headingHighlight: x })} placeholder="Long-Term Partnerships (accent)" />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Testimonials"
        description="Quote cards."
        action={<AddButton label="Add testimonial" onClick={() => setItems([...v.items, { quote: "", author: "", role: "" }])} />}
      >
        {v.items.length === 0 ? (
          <EmptyRow text="No testimonials yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.items.map((item, i) => {
              const upd = (patch: Partial<ClientTestimonialItem>) => setItems(v.items.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
              return (
                <RepeaterItem key={i} onRemove={() => setItems(v.items.filter((_, idx) => idx !== i))}>
                  <Field label="Quote"><TextArea value={item.quote} onChange={(x) => upd({ quote: x })} rows={3} /></Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Author"><TextInput value={item.author} onChange={(x) => upd({ author: x })} placeholder="Engineering Manager" /></Field>
                    <Field label="Role"><TextInput value={item.role} onChange={(x) => upd({ role: x })} placeholder="FMCG Multinational, Dhaka" /></Field>
                  </div>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
