"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RemoveButton,
  SectionCard,
  TextInput,
} from "@/components/admin/form-primitives";
import type { HeaderContent, HeaderNavLink } from "@/data/content-types";

export const EMPTY_HEADER: HeaderContent = {
  logo: "/logo.png",
  navLinks: [],
  ctaLabel: "",
  ctaHref: "",
};

export function HeaderForm({
  value,
  onChange,
  slug,
}: {
  value: HeaderContent | undefined;
  onChange: (next: HeaderContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_HEADER;
  const set = (patch: Partial<HeaderContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Logo" description="Shown top-left on every page.">
        <MediaField label="Logo" kind="image" slug={slug} value={v.logo} onChange={(x) => set({ logo: x })} />
      </SectionCard>

      <SectionCard
        title="Navigation links"
        description="The main nav, in order."
        action={<AddButton label="Add link" onClick={() => set({ navLinks: [...v.navLinks, { label: "", href: "" }] })} />}
      >
        {v.navLinks.length === 0 ? (
          <EmptyRow text="No links yet — add one, or load the demo." />
        ) : (
          <div className="space-y-2">
            {v.navLinks.map((link, i) => {
              const upd = (patch: Partial<HeaderNavLink>) => set({ navLinks: v.navLinks.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) });
              return (
                <div key={i} className="flex items-end gap-2">
                  <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                    <Field label="Label"><TextInput value={link.label} onChange={(x) => upd({ label: x })} placeholder="Projects" /></Field>
                    <Field label="Link"><TextInput value={link.href} onChange={(x) => upd({ href: x })} placeholder="/projects" /></Field>
                  </div>
                  <RemoveButton onClick={() => set({ navLinks: v.navLinks.filter((_, idx) => idx !== i) })} />
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Call-to-action button">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Label"><TextInput value={v.ctaLabel} onChange={(x) => set({ ctaLabel: x })} placeholder="Contact Us →" /></Field>
          <Field label="Link"><TextInput value={v.ctaHref} onChange={(x) => set({ ctaHref: x })} placeholder="/contact" /></Field>
        </div>
      </SectionCard>
    </div>
  );
}
