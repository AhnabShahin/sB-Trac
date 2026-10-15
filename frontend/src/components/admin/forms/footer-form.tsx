"use client";

import { Field, MediaField, SectionCard, StringListField, TextInput } from "@/components/admin/form-primitives";
import type { FooterContent } from "@/data/content-types";

export const EMPTY_FOOTER: FooterContent = {
  logo: "/logo.png",
  copyrightText: "",
  badges: [],
};

export function FooterForm({
  value,
  onChange,
  slug,
}: {
  value: FooterContent | undefined;
  onChange: (next: FooterContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_FOOTER;
  const set = (patch: Partial<FooterContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Logo" description="Shown bottom-left of the footer, on every page.">
        <MediaField label="Logo" kind="image" slug={slug} value={v.logo} onChange={(x) => set({ logo: x })} />
      </SectionCard>

      <SectionCard title="Copyright" description="Shown after the auto-filled year, e.g. “© 2026 …”.">
        <Field label="Text"><TextInput value={v.copyrightText} onChange={(x) => set({ copyrightText: x })} placeholder="B-Trac Engineering Ltd. · A Bangla Trac Group Company" /></Field>
      </SectionCard>

      <StringListField
        title="Certification badges"
        description="The small chips on the right of the footer."
        items={v.badges}
        onChange={(badges) => set({ badges })}
        placeholder="ISO 9001:2015"
      />
    </div>
  );
}
