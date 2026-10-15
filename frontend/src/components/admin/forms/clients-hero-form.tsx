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
} from "@/components/admin/form-primitives";
import type {
  ClientsHeroContent,
  ClientsTrustBadge,
  ClientsTrustIcon,
  ProjectsAccent,
} from "@/data/content-types";
import { ACCENT_OPTIONS } from "@/components/admin/forms/projects-hero-form";

export const EMPTY_CLIENTS_HERO: ClientsHeroContent = {
  accent: "teal",
  badge: "",
  headingLine1: "",
  headingHighlight: "",
  headingSuffix: "",
  subhead: "",
  image: "",
  badges: [],
};

const TRUST_ICONS = [
  { value: "factory", label: "Factory" },
  { value: "globe", label: "Globe" },
  { value: "landmark", label: "Landmark" },
  { value: "cap", label: "Graduation cap" },
];

export function ClientsHeroForm({
  value,
  onChange,
  slug,
}: {
  value: ClientsHeroContent | undefined;
  onChange: (next: ClientsHeroContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_CLIENTS_HERO;
  const set = (patch: Partial<ClientsHeroContent>) => onChange({ ...v, ...patch });
  const setBadges = (badges: ClientsTrustBadge[]) => set({ badges });

  return (
    <div className="space-y-5">
      <SectionCard title="Hero heading" description="The page banner — badge, big heading and intro.">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
            <Field label="Badge"><TextInput value={v.badge} onChange={(x) => set({ badge: x })} placeholder="60+ Industry Leaders" /></Field>
            <Field label="Accent colour"><Select value={v.accent} onChange={(x) => set({ accent: x as ProjectsAccent })} options={ACCENT_OPTIONS} /></Field>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">Heading</span>
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput value={v.headingLine1} onChange={(x) => set({ headingLine1: x })} placeholder="Bangladesh's Most" />
              <TextInput value={v.headingHighlight} onChange={(x) => set({ headingHighlight: x })} placeholder="Demanding Clients (accent)" />
              <TextInput value={v.headingSuffix} onChange={(x) => set({ headingSuffix: x })} placeholder="Trust BTEL." />
            </div>
          </div>
          <Field label="Intro"><TextArea value={v.subhead} onChange={(x) => set({ subhead: x })} rows={3} /></Field>
          <MediaField label="Background image" kind="image" slug={slug} value={v.image} onChange={(x) => set({ image: x })} />
        </div>
      </SectionCard>

      <SectionCard
        title="Trust badges"
        description="The small cards under the intro."
        action={<AddButton label="Add badge" onClick={() => setBadges([...v.badges, { icon: "factory", title: "", subtitle: "" }])} />}
      >
        {v.badges.length === 0 ? (
          <EmptyRow text="No badges yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.badges.map((badge, i) => {
              const upd = (patch: Partial<ClientsTrustBadge>) => setBadges(v.badges.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
              return (
                <RepeaterItem key={i} onRemove={() => setBadges(v.badges.filter((_, idx) => idx !== i))}>
                  <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
                    <Field label="Icon"><Select value={badge.icon} onChange={(x) => upd({ icon: x as ClientsTrustIcon })} options={TRUST_ICONS} /></Field>
                    <Field label="Title"><TextInput value={badge.title} onChange={(x) => upd({ title: x })} placeholder="60+ Clients" /></Field>
                  </div>
                  <Field label="Subtitle"><TextInput value={badge.subtitle} onChange={(x) => upd({ subtitle: x })} placeholder="All sectors" /></Field>
                </RepeaterItem>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
