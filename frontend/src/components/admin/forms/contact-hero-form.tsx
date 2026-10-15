"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RepeaterItem,
  SectionCard,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { ContactHeroContent, ContactWhatsappLink } from "@/data/content-types";

export const EMPTY_CONTACT_HERO: ContactHeroContent = {
  badge: "",
  headingLine1: "",
  headingHighlight: "",
  headingLine3: "",
  subhead: "",
  image: "",
  whatsappEyebrow: "",
  whatsappLinks: [],
};

export function ContactHeroForm({
  value,
  onChange,
  slug,
}: {
  value: ContactHeroContent | undefined;
  onChange: (next: ContactHeroContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_CONTACT_HERO;
  const set = (patch: Partial<ContactHeroContent>) => onChange({ ...v, ...patch });
  const setLinks = (whatsappLinks: ContactWhatsappLink[]) => set({ whatsappLinks });

  return (
    <div className="space-y-5">
      <SectionCard title="Hero heading" description="The banner above the inquiry form.">
        <div className="space-y-4">
          <Field label="Badge"><TextInput value={v.badge} onChange={(x) => set({ badge: x })} placeholder="We Respond Within 24 Hours" /></Field>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">Heading</span>
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Let's Engineer" />
              <TextInput value={v.headingHighlight} onChange={(x) => set({ headingHighlight: x })} placeholder="Your Next (accent)" />
              <TextInput value={v.headingLine3} onChange={(x) => set({ headingLine3: x })} placeholder="Project" />
            </div>
          </div>
          <Field label="Intro"><TextArea value={v.subhead} onChange={(x) => set({ subhead: x })} rows={3} /></Field>
          <MediaField label="Background image" kind="image" slug={slug} value={v.image} onChange={(x) => set({ image: x })} />
        </div>
      </SectionCard>

      <SectionCard
        title="WhatsApp links"
        description="The instant-chat buttons under the intro."
        action={<AddButton label="Add link" onClick={() => setLinks([...v.whatsappLinks, { label: "", waId: "" }])} />}
      >
        <Field label="Eyebrow"><TextInput value={v.whatsappEyebrow} onChange={(x) => set({ whatsappEyebrow: x })} placeholder="Or chat with us instantly on WhatsApp" /></Field>
        <div className="mt-3">
          {v.whatsappLinks.length === 0 ? (
            <EmptyRow text="No links yet — add one, or load the demo." />
          ) : (
            <div className="space-y-3">
              {v.whatsappLinks.map((link, i) => {
                const upd = (patch: Partial<ContactWhatsappLink>) => setLinks(v.whatsappLinks.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
                return (
                  <RepeaterItem key={i} onRemove={() => setLinks(v.whatsappLinks.filter((_, idx) => idx !== i))}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Display label"><TextInput value={link.label} onChange={(x) => upd({ label: x })} placeholder="+88 01990-515151" /></Field>
                      <Field label="WhatsApp number" hint="Digits only, with country code."><TextInput value={link.waId} onChange={(x) => upd({ waId: x })} placeholder="8801990515151" /></Field>
                    </div>
                  </RepeaterItem>
                );
              })}
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
