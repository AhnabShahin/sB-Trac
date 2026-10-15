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
import type { ServiceCardItem, ServiceCardSectionContent, ServiceIconKey } from "@/data/content-types";

export const EMPTY_SERVICE_CARD_SECTION: ServiceCardSectionContent = {
  eyebrow: "",
  heading: "",
  intro: "",
  cards: [],
};

// Shared card-grid editor reused across every products-services sub-page:
// substation's capabilities/features, solar's system types/features, mep's
// services, water-treatment's features, after-sales' services. Each card is a
// colourful icon tile — the admin sets its own accent hex.
export function ServiceCardSectionForm({
  value,
  onChange,
  cardLabel = "card",
  showTag = false,
  showHighlight = false,
}: {
  value: ServiceCardSectionContent | undefined;
  onChange: (next: ServiceCardSectionContent) => void;
  slug: string;
  cardLabel?: string;
  showTag?: boolean;
  showHighlight?: boolean;
}) {
  const v = value ?? EMPTY_SERVICE_CARD_SECTION;
  const set = (patch: Partial<ServiceCardSectionContent>) => onChange({ ...v, ...patch });

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
        title={`Cards`}
        description={`Each ${cardLabel} — icon, colour, copy and a link into the product catalogue.`}
        action={
          <AddButton
            label="Add card"
            onClick={() =>
              set({
                cards: [
                  ...v.cards,
                  { icon: "bolt", title: "", description: "", href: "", accentColor: "#0A9E88" },
                ],
              })
            }
          />
        }
      >
        {v.cards.length === 0 ? (
          <EmptyRow text="No cards yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.cards.map((card, i) => {
              const upd = (patch: Partial<ServiceCardItem>) =>
                set({ cards: v.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
              return (
                <RepeaterItem key={i} onRemove={() => set({ cards: v.cards.filter((_, idx) => idx !== i) })}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                    <Field label="Icon">
                      <Select value={card.icon} onChange={(x) => upd({ icon: x as ServiceIconKey })} options={SERVICE_ICON_OPTIONS} />
                    </Field>
                    <ColorField label="Accent colour" value={card.accentColor} onChange={(x) => upd({ accentColor: x })} />
                  </div>
                  <Field label="Title"><TextInput value={card.title} onChange={(x) => upd({ title: x })} /></Field>
                  <Field label="Description"><TextArea value={card.description} onChange={(x) => upd({ description: x })} rows={2} /></Field>
                  <Field label="Link (optional)"><TextInput value={card.href ?? ""} onChange={(x) => upd({ href: x })} placeholder="/products-services#…" /></Field>
                  {showTag ? (
                    <Field label="Badge tag (optional)"><TextInput value={card.tag ?? ""} onChange={(x) => upd({ tag: x })} placeholder="Net Metering Ready" /></Field>
                  ) : null}
                  {showHighlight ? (
                    <label className="flex items-center gap-2 text-xs font-medium text-muted">
                      <input type="checkbox" checked={!!card.highlight} onChange={(e) => upd({ highlight: e.target.checked })} />
                      Highlight this card
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
