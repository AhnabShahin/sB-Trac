"use client";

import { Field, SectionCard, TextInput, inputCls } from "@/components/admin/form-primitives";
import type { CompanyStat, PrincipleContent } from "@/data/content-types";
import { EMPTY_PRINCIPLE } from "@/components/admin/forms/principle-form";

const STAT_COUNT = 4;
const EMPTY_STAT: CompanyStat = { value: "", accent: "+", description: "" };

// The stat band is a fixed four-up row in the design, so this editor exposes
// exactly four slots rather than an unbounded repeater — you edit the four pairs,
// you never add or remove one.
export function StatBandForm({
  value,
  onChange,
}: {
  value: PrincipleContent | undefined;
  onChange: (next: PrincipleContent) => void;
  slug: string;
}) {
  const v = value ?? EMPTY_PRINCIPLE;
  const stats = Array.from({ length: STAT_COUNT }, (_, i) => v.stats[i] ?? { ...EMPTY_STAT });

  const updStat = (i: number, patch: Partial<CompanyStat>) =>
    onChange({ ...v, stats: stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });

  return (
    <div className="space-y-5">
      <SectionCard title="Stat band" description="The four big counters below the Who We Are intro. Exactly four — value, suffix and caption each.">
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-navy/40 p-3.5">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Stat {i + 1}
              </div>
              <div className="grid grid-cols-[6rem_5rem_1fr] items-start gap-2">
                <Field label="Value"><TextInput value={stat.value} onChange={(x) => updStat(i, { value: x })} placeholder="250" /></Field>
                <Field label="Suffix"><TextInput value={stat.accent ?? ""} onChange={(x) => updStat(i, { accent: x })} placeholder="+" /></Field>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted">Caption</span>
                  <input className={inputCls} value={stat.description} placeholder="Industry-leading clients served nationwide" onChange={(e) => updStat(i, { description: e.target.value })} />
                </label>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
