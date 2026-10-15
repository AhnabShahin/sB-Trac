"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  RepeaterItem,
  SectionCard,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type {
  ContactCardIcon,
  ContactDetailCard,
  ContactDetailsContent,
  ContactSocialLink,
} from "@/data/content-types";

export const EMPTY_CONTACT_DETAILS: ContactDetailsContent = {
  eyebrow: "",
  heading: "",
  intro: "",
  cards: [],
  socials: [],
  mapLabel: "",
  mapEmbedSrc: "",
};

const ICONS = [
  { value: "pin", label: "Pin (location)" },
  { value: "factory", label: "Factory" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "mail", label: "Mail" },
  { value: "globe", label: "Globe (website)" },
  { value: "clock", label: "Clock (hours)" },
  { value: "shield", label: "Shield (emergency)" },
];

const SOCIALS = [
  { value: "Facebook", label: "Facebook" },
  { value: "LinkedIn", label: "LinkedIn" },
];

export function ContactDetailsForm({
  value,
  onChange,
}: {
  value: ContactDetailsContent | undefined;
  onChange: (next: ContactDetailsContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_CONTACT_DETAILS;
  const set = (patch: Partial<ContactDetailsContent>) => onChange({ ...v, ...patch });
  const setCards = (cards: ContactDetailCard[]) => set({ cards });
  const setSocials = (socials: ContactSocialLink[]) => set({ socials });

  return (
    <div className="space-y-5">
      <SectionCard title="Section heading">
        <div className="space-y-4">
          <Field label="Eyebrow"><TextInput value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} placeholder="Find Us" /></Field>
          <Field label="Heading"><TextInput value={v.heading} onChange={(x) => set({ heading: x })} placeholder="Contact Details" /></Field>
          <Field label="Intro"><TextArea value={v.intro} onChange={(x) => set({ intro: x })} rows={2} /></Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Contact cards"
        description="Each card. 'Full width' spans both columns; 'accent' tints it teal."
        action={<AddButton label="Add card" onClick={() => setCards([...v.cards, { icon: "pin", label: "", value: "" }])} />}
      >
        {v.cards.length === 0 ? (
          <EmptyRow text="No cards yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.cards.map((card, i) => {
              const upd = (patch: Partial<ContactDetailCard>) => setCards(v.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
              return (
                <RepeaterItem key={i} onRemove={() => setCards(v.cards.filter((_, idx) => idx !== i))}>
                  <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
                    <Field label="Icon"><Select value={card.icon} onChange={(x) => upd({ icon: x as ContactCardIcon })} options={ICONS} /></Field>
                    <Field label="Label"><TextInput value={card.label} onChange={(x) => upd({ label: x })} placeholder="Head Office" /></Field>
                  </div>
                  <Field label="Value"><TextInput value={card.value} onChange={(x) => upd({ value: x })} placeholder="Plot-68, Block-H, Road-11, Banani…" /></Field>
                  <Field label="Link (optional)" hint="tel: / mailto: / https: — leave blank for plain text."><TextInput value={card.href ?? ""} onChange={(x) => upd({ href: x || undefined })} placeholder="tel:+8801990515151" /></Field>
                  <div className="flex flex-wrap gap-5 pt-1">
                    <label className="flex items-center gap-2 text-xs font-medium text-muted">
                      <input type="checkbox" checked={!!card.full} onChange={(e) => upd({ full: e.target.checked || undefined })} />
                      Full width
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-muted">
                      <input type="checkbox" checked={!!card.accent} onChange={(e) => upd({ accent: e.target.checked || undefined })} />
                      Teal accent
                    </label>
                  </div>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Social links"
        description="Facebook / LinkedIn buttons."
        action={<AddButton label="Add social" onClick={() => setSocials([...v.socials, { label: "Facebook", href: "" }])} />}
      >
        {v.socials.length === 0 ? (
          <EmptyRow text="No social links yet." />
        ) : (
          <div className="space-y-3">
            {v.socials.map((social, i) => {
              const upd = (patch: Partial<ContactSocialLink>) => setSocials(v.socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
              return (
                <RepeaterItem key={i} onRemove={() => setSocials(v.socials.filter((_, idx) => idx !== i))}>
                  <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
                    <Field label="Network"><Select value={social.label} onChange={(x) => upd({ label: x as ContactSocialLink["label"] })} options={SOCIALS} /></Field>
                    <Field label="URL"><TextInput value={social.href} onChange={(x) => upd({ href: x })} placeholder="https://facebook.com/btraceng" /></Field>
                  </div>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Map" description="Google Maps embed under the cards.">
        <div className="space-y-4">
          <Field label="Map label"><TextInput value={v.mapLabel} onChange={(x) => set({ mapLabel: x })} placeholder="Head Office Location" /></Field>
          <Field label="Embed URL" hint="The src of a Google Maps embed (…?output=embed).">
            <TextArea value={v.mapEmbedSrc} onChange={(x) => set({ mapEmbedSrc: x })} rows={2} />
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}
