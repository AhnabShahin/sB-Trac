"use client";

import {
  Field,
  MediaField,
  SectionCard,
  TextArea,
  TextInput,
} from "@/components/admin/form-primitives";
import type { IsoBandContent } from "@/data/content-types";

export const EMPTY_ISO: IsoBandContent = {
  headingPrefix: "",
  headingHighlight: "",
  headingSuffix: "",
  text: "",
  badge: "",
  badgeAlt: "",
};

export function IsoForm({
  value,
  onChange,
  slug,
}: {
  value: IsoBandContent | undefined;
  onChange: (next: IsoBandContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_ISO;
  const set = (patch: Partial<IsoBandContent>) => onChange({ ...v, ...patch });

  return (
    <div className="space-y-5">
      <SectionCard title="Certification band" description="The slim ISO band with the seal.">
        <div className="space-y-4">
          <div>
            <span className="mb-1.5 block text-xs font-medium text-muted">Heading</span>
            <div className="grid gap-3 sm:grid-cols-3">
              <TextInput value={v.headingPrefix} onChange={(x) => set({ headingPrefix: x })} placeholder="ISO " />
              <TextInput value={v.headingHighlight} onChange={(x) => set({ headingHighlight: x })} placeholder="9001:2015" />
              <TextInput value={v.headingSuffix} onChange={(x) => set({ headingSuffix: x })} placeholder=" Certified" />
            </div>
            <p className="mt-1.5 text-[11px] text-muted">
              Middle part renders in <span className="text-teal-light">teal</span>.
            </p>
          </div>
          <Field label="Text"><TextArea value={v.text} onChange={(x) => set({ text: x })} rows={3} /></Field>
          <MediaField label="Seal / badge image" kind="image" slug={slug} value={v.badge} onChange={(x) => set({ badge: x })} />
          <Field label="Badge alt text"><TextInput value={v.badgeAlt} onChange={(x) => set({ badgeAlt: x })} /></Field>
        </div>
      </SectionCard>
    </div>
  );
}
