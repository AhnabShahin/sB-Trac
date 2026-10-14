"use client";

import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RepeaterItem,
  SectionCard,
  TextInput,
} from "@/components/admin/form-primitives";
import { deleteMedia, isManagedMedia } from "@/services/media";
import type { ClientMarqueeContent } from "@/data/content-types";

export const EMPTY_MARQUEE: ClientMarqueeContent = {
  ariaLabel: "",
  clients: [],
};

export function ClientMarqueeForm({
  value,
  onChange,
  slug,
}: {
  value: ClientMarqueeContent | undefined;
  onChange: (next: ClientMarqueeContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_MARQUEE;
  const set = (patch: Partial<ClientMarqueeContent>) => onChange({ ...v, ...patch });

  function updateClient(i: number, patch: Partial<ClientMarqueeContent["clients"][number]>) {
    set({ clients: v.clients.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
  }
  function addClient() {
    set({ clients: [...v.clients, { name: "", logo: "" }] });
  }
  function removeClient(i: number) {
    const logo = v.clients[i]?.logo;
    if (logo && isManagedMedia(logo)) deleteMedia(logo);
    set({ clients: v.clients.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Rail settings">
        <Field label="Accessible label" hint="Screen-reader name for the logo rail (not shown visually).">
          <TextInput value={v.ariaLabel} onChange={(x) => set({ ariaLabel: x })} placeholder="Trusted by 60+ industry leaders" />
        </Field>
      </SectionCard>

      <SectionCard
        title="Client logos"
        description={`The marquee of industry-leader marks. ${v.clients.length} logo${v.clients.length === 1 ? "" : "s"}.`}
        action={<AddButton label="Add logo" onClick={addClient} />}
      >
        {v.clients.length === 0 ? (
          <EmptyRow text="No logos yet — add one, or load the demo." />
        ) : (
          <div className="space-y-3">
            {v.clients.map((client, i) => (
              <RepeaterItem key={i} onRemove={() => removeClient(i)}>
                <Field label="Name">
                  <TextInput value={client.name} onChange={(x) => updateClient(i, { name: x })} placeholder="British American Tobacco" />
                </Field>
                <MediaField
                  label="Logo"
                  kind="image"
                  slug={slug}
                  value={client.logo}
                  onChange={(x) => updateClient(i, { logo: x })}
                />
              </RepeaterItem>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
