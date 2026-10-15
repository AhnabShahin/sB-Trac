"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  deleteInquiry,
  listInquiries,
  updateInquiryStatus,
  type Inquiry,
  type InquiryListResponse,
  type InquiryStatus,
} from "@/services/inquiries";

const STATUS_TABS: { key: InquiryStatus | ""; label: string; countKey: keyof InquiryListResponse["counts"] }[] = [
  { key: "", label: "All", countKey: "all" },
  { key: "new", label: "New", countKey: "new" },
  { key: "read", label: "Read", countKey: "read" },
  { key: "archived", label: "Archived", countKey: "archived" },
];

const STATUS_BADGE: Record<InquiryStatus, string> = {
  new: "border-teal/40 bg-teal/15 text-teal-light",
  read: "border-blue-light/40 bg-blue-light/15 text-blue-light",
  archived: "border-border bg-white/5 text-muted",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InquiriesWorkspace() {
  const [status, setStatus] = useState<InquiryStatus | "">("");
  const [service, setService] = useState("");
  const [q, setQ] = useState("");
  const [qInput, setQInput] = useState("");
  const [page, setPage] = useState(1);

  const [res, setRes] = useState<InquiryListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    listInquiries({ status, service, q, page })
      .then((data) => setRes(data))
      .catch((e) => setError((e as Error)?.message ?? "Failed to load inquiries."))
      .finally(() => setLoading(false));
  }, [status, service, q, page]);

  useEffect(() => {
    // load() flips loading/error before fetching; that synchronous setState in
    // an effect is intentional here (a filter/page change must show a loading
    // state immediately), so the cascading-render lint rule is suppressed.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  function changeStatusFilter(next: InquiryStatus | "") {
    setStatus(next);
    setPage(1);
  }

  function changeService(next: string) {
    setService(next);
    setPage(1);
  }

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    setQ(qInput.trim());
    setPage(1);
  }

  function clearSearch() {
    setQInput("");
    setQ("");
    setPage(1);
  }

  async function setInquiryStatus(inq: Inquiry, next: InquiryStatus) {
    setBusyId(inq.id);
    try {
      const { data } = await updateInquiryStatus(inq.id, next);
      setSelected((s) => (s && s.id === data.id ? data : s));
      load();
    } catch (e) {
      setError((e as Error)?.message ?? "Update failed.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeInquiry(inq: Inquiry) {
    if (!window.confirm(`Delete the inquiry from ${inq.full_name}? This cannot be undone.`)) return;
    setBusyId(inq.id);
    try {
      await deleteInquiry(inq.id);
      if (selected?.id === inq.id) setSelected(null);
      load();
    } catch (e) {
      setError((e as Error)?.message ?? "Delete failed.");
    } finally {
      setBusyId(null);
    }
  }

  // Opening a "new" inquiry marks it read, so the New badge reflects the unread
  // queue rather than everything ever received.
  function openInquiry(inq: Inquiry) {
    setSelected(inq);
    if (inq.status === "new") void setInquiryStatus(inq, "read");
  }

  const meta = res?.meta;
  const rows = res?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl pt-4 sm:pt-6 lg:pt-8">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-offwhite">Inquiries</h1>
        <p className="mt-1 text-sm text-muted">
          Contact-form submissions from the website. Filter, search and triage them here.
        </p>
      </header>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {/* Status tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const count = res?.counts[tab.countKey];
          const active = status === tab.key;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => changeStatusFilter(tab.key)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                active ? "bg-teal/15 text-teal-light" : "text-muted hover:bg-white/5 hover:text-offwhite"
              }`}
            >
              {tab.label}
              {typeof count === "number" ? (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? "bg-teal/25 text-teal-light" : "bg-border/60 text-muted"}`}>
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2.5">
        <form onSubmit={submitSearch} className="flex min-w-0 flex-1 items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Search name, company, email or message…"
              className="w-full rounded-lg border border-border bg-navy px-3.5 py-2.5 text-sm text-offwhite placeholder:text-muted/60 outline-none transition-all focus:border-teal/60 focus:ring-2 focus:ring-teal/15"
            />
            {q ? (
              <button type="button" onClick={clearSearch} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1.5 text-muted hover:text-offwhite">
                ✕
              </button>
            ) : null}
          </div>
          <button type="submit" className="rounded-lg border border-border px-3.5 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-white/5">
            Search
          </button>
        </form>
        <select
          value={service}
          onChange={(e) => changeService(e.target.value)}
          className="rounded-lg border border-border bg-navy px-3 py-2.5 text-sm text-offwhite outline-none transition-all focus:border-teal/60 focus:ring-2 focus:ring-teal/15"
        >
          <option value="">All services</option>
          {res?.services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading && !res ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-navy/30 px-4 py-12 text-center text-sm text-muted">
          No inquiries match these filters yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-navy2 text-[11px] uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-semibold">Name / Company</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Budget</th>
                  <th className="px-4 py-3 font-semibold">Received</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => openInquiry(inq)}
                    className="cursor-pointer border-b border-border/60 bg-card transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-offwhite">{inq.full_name || "—"}</div>
                      <div className="text-xs text-muted">{inq.company}</div>
                    </td>
                    <td className="px-4 py-3 text-muted">{inq.service}</td>
                    <td className="px-4 py-3 text-muted">{inq.budget || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted">{formatDate(inq.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_BADGE[inq.status]}`}>
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {meta.from ?? 0}–{meta.to ?? 0} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={meta.current_page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-offwhite transition-colors hover:bg-white/5 disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-xs text-muted">
              Page {meta.current_page} / {meta.last_page}
            </span>
            <button
              type="button"
              disabled={meta.current_page >= meta.last_page || loading}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-offwhite transition-colors hover:bg-white/5 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      ) : null}

      {selected ? (
        <InquiryDetail
          inquiry={selected}
          busy={busyId === selected.id}
          onClose={() => setSelected(null)}
          onStatus={(next) => setInquiryStatus(selected, next)}
          onDelete={() => removeInquiry(selected)}
        />
      ) : null}
    </div>
  );
}

function InquiryDetail({
  inquiry,
  busy,
  onClose,
  onStatus,
  onDelete,
}: {
  inquiry: Inquiry;
  busy: boolean;
  onClose: () => void;
  onStatus: (next: InquiryStatus) => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-navy2 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate font-display text-lg font-bold text-offwhite">{inquiry.full_name}</h2>
            <p className="truncate text-xs text-muted">{inquiry.company}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-offwhite">
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-2">
            <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_BADGE[inquiry.status]}`}>
              {inquiry.status}
            </span>
            <span className="text-xs text-muted">{formatDate(inquiry.created_at)}</span>
          </div>

          <DetailRow label="Email" value={inquiry.email} href={`mailto:${inquiry.email}`} />
          {inquiry.phone ? <DetailRow label="Phone" value={inquiry.phone} href={`tel:${inquiry.phone}`} /> : null}
          <DetailRow label="Service" value={inquiry.service} />
          {inquiry.location ? <DetailRow label="Location" value={inquiry.location} /> : null}
          {inquiry.budget ? <DetailRow label="Budget" value={inquiry.budget} /> : null}
          <DetailRow label="Newsletter opt-in" value={inquiry.newsletter ? "Yes" : "No"} />

          <div>
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted">Message</div>
            <p className="whitespace-pre-line rounded-lg border border-border bg-card px-3.5 py-3 text-sm leading-relaxed text-offwhite/90">
              {inquiry.message}
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-border px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <StatusButton active={inquiry.status === "new"} disabled={busy} onClick={() => onStatus("new")}>Mark new</StatusButton>
            <StatusButton active={inquiry.status === "read"} disabled={busy} onClick={() => onStatus("read")}>Mark read</StatusButton>
            <StatusButton active={inquiry.status === "archived"} disabled={busy} onClick={() => onStatus("archived")}>Archive</StatusButton>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onDelete}
            className="w-full rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-40"
          >
            Delete inquiry
          </button>
        </div>
      </aside>
    </div>
  );
}

function DetailRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <div className="mb-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">{label}</div>
      {href ? (
        <a href={href} className="break-words text-sm font-medium text-teal-light hover:underline">
          {value}
        </a>
      ) : (
        <div className="break-words text-sm font-medium text-offwhite">{value}</div>
      )}
    </div>
  );
}

function StatusButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled || active}
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed ${
        active
          ? "border-teal/40 bg-teal/15 text-teal-light"
          : "border-border text-offwhite hover:bg-white/5 disabled:opacity-40"
      }`}
    >
      {children}
    </button>
  );
}
