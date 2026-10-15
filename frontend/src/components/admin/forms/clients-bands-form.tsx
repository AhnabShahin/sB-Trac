"use client";

import { useState } from "react";
import {
  AddButton,
  EmptyRow,
  Field,
  MediaField,
  RemoveButton,
  SectionCard,
  Select,
  TextInput,
} from "@/components/admin/form-primitives";
import type {
  ClientIndustryAccent,
  ClientIndustryGroup,
  ClientIndustryIcon,
  ClientLogoEntry,
  ClientsBandsContent,
} from "@/data/content-types";

export const EMPTY_CLIENTS_BANDS: ClientsBandsContent = { industries: [] };

const ICONS = [
  { value: "cart", label: "Cart (FMCG)" },
  { value: "crane", label: "Crane (industrial)" },
  { value: "bolt", label: "Bolt (energy)" },
  { value: "flask", label: "Flask (pharma)" },
  { value: "broadcast", label: "Broadcast (telecom)" },
  { value: "landmark", label: "Landmark (government)" },
  { value: "cap", label: "Cap (education)" },
];

const ACCENTS = [
  { value: "teal", label: "Teal" },
  { value: "blue", label: "Blue" },
  { value: "amber", label: "Amber" },
  { value: "purple", label: "Purple" },
];

const emptyGroup = (): ClientIndustryGroup => ({
  industry: "",
  icon: "cart",
  accent: "teal",
  focus: "",
  clients: [],
});

export function ClientsBandsForm({
  value,
  onChange,
  slug,
}: {
  value: ClientsBandsContent | undefined;
  onChange: (next: ClientsBandsContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_CLIENTS_BANDS;
  const list = v.industries;
  const [open, setOpen] = useState<number | null>(null);

  const setList = (industries: ClientIndustryGroup[]) => onChange({ ...v, industries });
  const upd = (i: number, patch: Partial<ClientIndustryGroup>) =>
    setList(list.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));

  if (open !== null) {
    const g = list[open];
    if (!g) {
      setOpen(null);
      return null;
    }
    const setClients = (clients: ClientLogoEntry[]) => upd(open, { clients });
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setOpen(null)} aria-label="Back" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-teal/40 hover:bg-white/5 hover:text-offwhite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <nav className="flex items-center gap-2 text-sm leading-none">
            <button type="button" onClick={() => setOpen(null)} className="font-medium text-muted transition-colors hover:text-teal-light">Industries</button>
            <span className="text-muted/40">/</span>
            <span className="max-w-[18rem] truncate font-display font-bold text-offwhite">{g.industry || "Untitled"}</span>
          </nav>
        </div>

        <SectionCard title="Industry group">
          <div className="space-y-3">
            <Field label="Industry name"><TextInput value={g.industry} onChange={(x) => upd(open, { industry: x })} placeholder="FMCG & Consumer Goods" /></Field>
            <Field label="Focus line"><TextInput value={g.focus} onChange={(x) => upd(open, { focus: x })} placeholder="Multinational brands · Electrical & MEP" /></Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Icon"><Select value={g.icon} onChange={(x) => upd(open, { icon: x as ClientIndustryIcon })} options={ICONS} /></Field>
              <Field label="Accent colour"><Select value={g.accent} onChange={(x) => upd(open, { accent: x as ClientIndustryAccent })} options={ACCENTS} /></Field>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Clients in this industry"
          description="Each appears as a logo tile in the rail. A client with no logo falls back to its name."
          action={<AddButton label="Add client" onClick={() => setClients([...g.clients, { name: "", logo: "" }])} />}
        >
          {g.clients.length === 0 ? (
            <EmptyRow text="No clients yet — add one." />
          ) : (
            <div className="space-y-3">
              {g.clients.map((client, i) => {
                const updClient = (patch: Partial<ClientLogoEntry>) => setClients(g.clients.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
                return (
                  <div key={i} className="rounded-xl border border-border/60 bg-navy/40 p-3">
                    <div className="mb-2 flex items-end gap-2">
                      <div className="min-w-0 flex-1">
                        <Field label={`Client name ${i + 1}`}><TextInput value={client.name} onChange={(x) => updClient({ name: x })} placeholder="British American Tobacco" /></Field>
                      </div>
                      <RemoveButton onClick={() => setClients(g.clients.filter((_, idx) => idx !== i))} />
                    </div>
                    <MediaField label="Logo (optional)" kind="image" slug={slug} value={client.logo ?? ""} onChange={(x) => updClient({ logo: x })} />
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Industry bands"
        description="Clients grouped by sector. Open a group to edit it and its clients."
        action={<AddButton label="Add industry" onClick={() => { setList([...list, emptyGroup()]); setOpen(list.length); }} />}
      >
        {list.length === 0 ? (
          <EmptyRow text="No industries yet — add one, or load the demo." />
        ) : (
          <div className="space-y-2">
            {list.map((g, i) => (
              <div key={i} className="group flex items-center gap-3 rounded-lg border border-border bg-navy/40 p-2.5 transition-colors hover:border-teal/40">
                <button type="button" onClick={() => setOpen(i)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-navy text-[10px] font-bold uppercase text-muted">
                    {g.clients.length}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-offwhite">{g.industry || "Untitled industry"}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted">{g.clients.length} client{g.clients.length !== 1 ? "s" : ""} · {g.accent}</span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M9 6l6 6-6 6" /></svg>
                  </span>
                </button>
                <RemoveButton onClick={() => setList(list.filter((_, idx) => idx !== i))} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
